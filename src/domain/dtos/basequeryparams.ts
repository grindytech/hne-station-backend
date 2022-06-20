import { ApiProperty } from '@nestjs/swagger';

export class BaseQueryParams {
  @ApiProperty({ required: false, nullable: true })
  search: string;
  @ApiProperty({ required: false })
  page = 1;
  _size = 10;
  @ApiProperty({ required: false })
  public set size(size: number) {
    this._size = size;
  }
  public get size() {
    return this._size < 100 ? this._size : 100;
  }
  @ApiProperty({ required: false, nullable: true })
  orderBy: string;
  @ApiProperty({ required: false, nullable: true, enum: ['desc', 'asc'] })
  desc: string | null;
  // skipIndex = this.size * (this.page - 1);
  public get skipIndex() {
    return this.size * (this.page - 1);
  }
  public get sort() {
    const order: any = [];
    order.push(this.orderBy ?? 'createdAt');
    order.push('asc' ? 'asc' : 'desc');
    return order;
  }
}
