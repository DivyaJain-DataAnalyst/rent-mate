import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RentalStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, dto: CreateReviewDto){
    const rental = await this.prisma.rental.findUnique({
      where: { id: dto.rentalId },
      include: { listing: true },
    });

    if (!rental) {
      throw new BadRequestException('Rental not found');
    }

    if (rental.status !== RentalStatus.completed){
      throw new ForbiddenException('Reviews allowed only after completion');
    }

    const isRenter = rental.renterId === userId;
    const isOwner = rental.listing.ownerId === userId;

    if (!isRenter && !isOwner) {
      throw new ForbiddenException('Not allowed to review this rental');
    }

    if (dto.revieweeId === userId) {
      throw new ForbiddenException('Cannot review yourself');
    }

    const expectedReviewee = isRenter
      ? rental.listing.ownerId
      : rental.renterId;

    if (dto.revieweeId !== expectedReviewee) {
      throw new ForbiddenException('Invalid review target');
    }

    const existing = await this.prisma.review.findFirst({
      where: {
        rentalId: dto.rentalId,
        reviewerId: userId,
      },
    });

    if (existing) {
      throw new ForbiddenException('Review already exists for this rental');
    }
    
    return this.prisma.review.create({
      data: {
        rentalId: dto.rentalId,
        reviewerId: userId,
        revieweeId: dto.revieweeId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async getUserReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAverageRating(userId: string) {
    const result = await this.prisma.review.aggregate({
      where: { revieweeId: userId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
    average: result._avg.rating ?? 0,
    count: result._count.rating ?? 0,
    };
  }
}