import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Request } from 'express';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(@Req() req: Request & { user: { id: string } }, @Body() dto: CreateReviewDto) {
    // assumes auth middleware sets req.user
    return this.reviewsService.createReview(req.user.id, dto);
  }

  @Get('user/:id')
  async getUserReviews(@Param('id') id: string) {
    return this.reviewsService.getUserReviews(id);
  }


  @Get('user/:id/summary')
  async getSummary(@Param('id') id: string) {
    return this.reviewsService.getAverageRating(id);
  }
}