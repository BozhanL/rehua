export class CreateHelloDto {
  constructor(
    public id: string,
    public content: string,
  ) {}
}

export class CreateHelloResponseDto {
  constructor(
    public id: string,
    public content: string,
    public createdAt: Date,
  ) {}
}
