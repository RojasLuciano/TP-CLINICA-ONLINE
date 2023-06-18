import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Specialty } from '../entities/specialty';
import { createCanvas, loadImage } from 'canvas'; // Importar las funciones necesarias para crear el canvas

export type icon = 'warning' | 'error' | 'success' | 'info' | 'question';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  captcha: any = [];

  constructor() { }

  modalMessage(msg: string, icon: icon) {
    Swal.fire({
      position: 'center',
      icon: icon,
      title: msg,
      showConfirmButton: false,
      timer: 2000
    })
  }
  modalMessageOk(msg: string, icon: icon) {
    Swal.fire({
      position: 'center',
      icon: icon,
      title: msg,
      confirmButtonText: 'Cerrar'
    })
  }

  async modalCancel(msg: string): Promise<SweetAlertResult<any>> {
    return await Swal.fire({
      title: '¿Estás seguro de borrar?',
      text: "No se podrá revertir la eliminación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar',
      confirmButtonText: 'Si, eliminarlo'
    });
  }

  async modalCancelConfirm(): Promise<SweetAlertResult<any>> {
    return await Swal.fire({
      title: '¿Estás seguro de borrar?',
      text: "No se podrá revertir la eliminación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    });
  }
  async modalCancelConfirmMsg(title: string, txt: string, icon: icon, btnMsg: string): Promise<SweetAlertResult<any>> {
    return await Swal.fire({
      title: title,
      text: txt,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: `Si, ${btnMsg}`,
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    });
  }

  modalSimple(title: string, msg: string, icon: icon) {
    Swal.fire(
      title,
      msg,
      icon
    )
  }

  async modalText(): Promise<Specialty> {
    const { value: result } = await Swal.fire({
      title: 'Nueva especialidad',
      input: 'text',
      inputLabel: 'Ingrese especialidad',
      inputPlaceholder: 'especialidad',
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar la especialidad'
        } else {
          return null;
        }
      }
    })

    if (result) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Captcha correcto',
        showConfirmButton: false,
        timer: 1500
      })
      let newSpecialty = new Specialty();
      newSpecialty.name = result;
      newSpecialty.id = '15';
      return newSpecialty;
    }
    return result;
  }

  async modalInputTextCancel(): Promise<string> {
    const { value: result } = await Swal.fire({
      title: 'Motivo de cancelación',
      input: 'text',
      inputLabel: 'Ingrese su motivo',
      inputPlaceholder: 'Motivo',
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar el motivo'
        } else {
          return null;
        }
      }
    })

    if (result) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Captcha correcto',
        showConfirmButton: false,
        timer: 1500
      })
    }
    return result;
  }

  async modalInputText(title: string, inputLabel: string, inputPlaceholder: string): Promise<string> {
    const { value: result } = await Swal.fire({
      title: title,
      input: 'text',
      inputLabel: inputLabel,
      inputPlaceholder: inputPlaceholder,
      inputValidator: (value) => {
        if (!value) {
          return `Debe ingresar ${inputPlaceholder}`
        } else {
          return null;
        }
      }
    })

    if (result) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Correcto',
        showConfirmButton: false,
        timer: 1500
      })
    }
    return result;
  }

  async modalCaptcha(): Promise<boolean> {
    const canvasWidth = 200; // Ancho de la imagen
    const canvasHeight = 100; // Alto de la imagen
    const captchaFont = '24px Arial'; // Fuente y tamaño del texto del captcha

    // Generar el captcha y guardar la respuesta en una variable
    let captcha2 = this.createCaptcha();

    // Crear un elemento canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);

    // Obtener el contexto de dibujo
    const context = canvas.getContext('2d');

    // Establecer propiedades de estilo
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.font = captchaFont;
    context.fillStyle = 'black';

    // Dibujar el texto del captcha en el centro de la imagen
    context.fillText(captcha2, canvasWidth / 2 - 50, canvasHeight / 2 + 10);

    // Dibujar una línea en el medio de la imagen
    context.beginPath();
    context.moveTo(0, canvasHeight / 2);
    context.lineTo(canvasWidth, canvasHeight / 2);
    context.strokeStyle = 'black';
    context.stroke();

    // Convertir la imagen a escala de grises
    const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // rojo
      data[i + 1] = avg; // verde
      data[i + 2] = avg; // azul
    }
    context.putImageData(imageData, 0, 0);

    // Obtener la imagen en formato base64
    const imageBase64 = canvas.toDataURL();

    const { value: result } = await Swal.fire({
      title: 'Ingrese el código',
      html: `<img src="${imageBase64}" alt="Captcha" />`,
      input: 'text',
      text: '¡No sea un robot!',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      inputValidator: (value) => {
        if (!value || value !== captcha2) {
          return 'El código ingresado es incorrecto.';
        } else {
          return null;
        }
      }
    });

    if (result) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Captcha correcto',
        showConfirmButton: false,
        timer: 1500
      });
      return true;
    }
    
    return false;
  }

  createCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    for (let q = 0; q < 6; q++) {
      if (q % 2 == 0) {
        captcha += characters.charAt(Math.floor(Math.random() * 26));
      } else {
        captcha += Math.floor(Math.random() * 10);
      }
    }
    return captcha;
  }
}
