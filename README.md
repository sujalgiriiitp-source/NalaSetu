# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## AWS Backend Setup

This project uses an AWS Lambda function for its backend (`nalasetu-api`), DynamoDB for storage, and Amazon S3 (`nalasetu-proof-2026`) for storing proof photos.

### S3 & IAM Configuration
1. The S3 bucket (`nalasetu-proof-2026`) must remain **PRIVATE**. Do NOT disable Block Public Access.
2. The Lambda function needs the following IAM inline policy attached to its execution role for minimal access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::nalasetu-proof-2026/*"
    }
  ]
}
```

3. Configure the `S3_BUCKET` environment variable on the Lambda function to `nalasetu-proof-2026`.
