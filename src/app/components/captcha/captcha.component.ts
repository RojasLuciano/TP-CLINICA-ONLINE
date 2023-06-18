import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { createCanvas } from 'canvas';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit, AfterViewInit {
  captcha: any = [];
  enteredCaptcha: any;
  generateCaptcha: any;
  captchaForDirective: any;
  @Output() captchaResult = new EventEmitter<boolean>();
  @ViewChild('captchaCanvas') captchaCanvasRef!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createCaptcha();
  }

  onChange(value: any) {
    if (value.length === 6) {
      setTimeout(() => {
        this.captchaForDirective = this.enteredCaptcha;
      }, 200);
    }
  }

  createCaptcha() {
    this.generateCaptcha = true;

    const canvas = createCanvas(150, 50);
    const context = canvas.getContext('2d');

    // Establece el estilo del captcha
    context.font = '30px Arial';
    context.fillStyle = 'black';

    // Genera el captcha
    const captcha = [];
    for (let q = 0; q < 6; q++) {
      if (q % 2 === 0) {
        captcha[q] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
      } else {
        captcha[q] = Math.floor(Math.random() * 10 + 0).toString();
      }
    }
    const theCaptcha = captcha.join('');
    this.captcha = theCaptcha;

    // Dibuja el captcha en el lienzo
    context.fillText(theCaptcha, 10, 35);

    // Convierte el lienzo en una imagen
    const captchaImage = new Image();
    captchaImage.src = canvas.toDataURL();

    // Muestra la imagen del captcha en el elemento de la plantilla
    const captchaCanvas = this.captchaCanvasRef.nativeElement;
    const ctx = captchaCanvas.getContext('2d');
    ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
    captchaImage.onload = () => {
      ctx.drawImage(captchaImage, 0, 0);
    };
  }

  newCaptcha(captcha: any) {
    this.captcha = captcha;
  }

  captchaResultDirective(captchaResult: any) {
    this.captchaResult.emit(captchaResult);
  }
}
