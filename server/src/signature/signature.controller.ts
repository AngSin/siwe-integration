import { Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { SignatureService } from './signature.service';
import {
  handleNoSiweSessionError,
  handleSiweErrorTypes,
} from '../utils/errorHandler';

@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Get('/nonce')
  getNonce(@Req() req, @Res() res) {
    req.session.nonce = this.signatureService.getNonce();
    res.status(HttpStatus.OK);
    return res.send(req.session.nonce);
  }

  @Post()
  async verifySignature(@Req() req, @Res() res) {
    const message = req.body.message;
    if (!message) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'Expected prepareMessage object as body.' });
    }
    try {
      const { siweMessage, expirationDate } =
        await this.signatureService.verifyAndGetCookieData(
          message,
          req.body.signature,
          req.session.nonce,
        );
      req.session.siwe = siweMessage;
      req.session.cookie.expires = expirationDate;
      req.session.save(() => res.status(HttpStatus.OK).send(true));
    } catch (e) {
      handleSiweErrorTypes(e, req, res);
    }
  }

  @Get('/info')
  async getPersonalInformation(@Req() req, @Res() res) {
    try {
      const address = this.signatureService.getPersonalInformation(req);
      res.setHeader('Content-Type', 'text/plain');
      res.send(address);
    } catch (e) {
      handleNoSiweSessionError(e, res);
    }
  }

  @Post('/logout')
  logOut(@Req() req, @Res() res) {
    req.session.siwe = null;
    res.sendStatus(HttpStatus.OK);
  }
}
