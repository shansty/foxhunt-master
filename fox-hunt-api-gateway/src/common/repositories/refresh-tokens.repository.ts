import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/refreshToken.entity';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  public async createRefreshToken(): Promise<number> {
    try {
      const refreshToken = await this.refreshTokenRepository
        .createQueryBuilder()
        .insert()
        .values({})
        .execute();
      return refreshToken.identifiers[0].refresh_token_id;
    } catch (err) {
      throw new HttpException('Creation of new refresh token error', 500);
    }
  }

  public async deleteRefreshTokenById(refresh_token_id: number) {
    return await this.refreshTokenRepository.delete({
      refresh_token_id,
    });
  }

  public async deleteRefreshTokensByTimestamp(
    min_date: Date,
  ): Promise<DeleteResult> {
    return await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .from(RefreshTokenEntity)
      .where('creation_date < :start_at', {
        start_at: min_date,
      })
      .execute();
  }
}
