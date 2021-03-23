<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
</div>

## NestJS Exceptions

### Installation

#### Yarn

```bash
yarn add @dollarsign/nestjs-exceptions
```

#### NPM

```bash
npm install --save @dollarsign/nestjs-exceptions
```

### Usage

To create a global-scoped filter, you would do the following:

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

To instantiate a microservice

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    AppModule,
    {
      transport: Transport.TCP,
    },
  );
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
}
bootstrap();
```

The following example uses a manually instantiated method-scoped filter. Just as with HTTP based applications, you can also use controller-scoped filters (i.e., prefix the controller class with a @UseFilters() decorator).

```typescript
@UseFilters(new GlobalRpcExceptionFilter())
@MessagePattern({ cmd: 'sum' })
accumulate(data: number[]): number {
  return (data || []).reduce((a, b) => a + b);
}

```

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

Dollarsign

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
