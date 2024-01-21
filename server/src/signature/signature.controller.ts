import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SignatureService } from './signature.service';

@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Get('/nonce')
  getNonce(@Req() req, @Res() res) {
    return this.signatureService.getNonce(req, res);
  }

  @Post()
  verifySignature(@Req() req, @Res() res) {
    return this.signatureService.verify(req, res);
  }

  @Get('/info')
  getPersonalInformation(@Req() req, @Res() res) {
    return this.signatureService.getPersonalInformation(req, res);
  }

  @Post('/logout')
  logOut(@Req() req, @Res() res) {
    return this.signatureService.logOut(req, res);
  }
}
