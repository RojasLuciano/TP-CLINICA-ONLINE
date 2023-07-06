import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Summary } from 'src/app/entities/summary';
import { Turns } from 'src/app/entities/turns';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { SummaryComponent } from '../summary/summary.component';

@Component({
  selector: 'app-turns-list-assigned',
  templateUrl: './turns-list-assigned.component.html',
  styleUrls: ['./turns-list-assigned.component.scss']
})
export class TurnsListAssignedComponent implements OnInit {

  userLogged = this.authService.getCurrentUser();
  turns: Turns[] = [];
  currentRate = 6;
  textFill: string = '';
  turnSelected!: Turns;

  abrirModal: boolean = false;
  abrirModala() {
    this.abrirModal = true;
  }

  open(content: any) {
    this.modalService.open(content);
  }

  constructor(private userService: UsersService, private authService: AuthService, private modal: ModalService, private modalService: NgbModal) { }


  ngOnInit(): void {
    this.userLogged.then((res) => {
      this.userService.getTurnId(res?.uid!, "specialistUid").subscribe(turns => {
        const combinedTurns: Turns[] = [];
  
        turns.forEach((turn: Turns) => {
          this.userService.getSummaryTurnId2(turn.id!).then((summary: Summary[]) => {
            const combinedTurn: Turns = {
              id: turn.id,
              name: turn.name,
              nameDate: turn.nameDate,
              specialist: turn.specialist,
              specialistUid: turn.specialistUid,
              specialty: turn.specialty,
              patient: turn.patient,
              patientUid: turn.patientUid,
              date: turn.date,
              day: turn.day,
              dayWeek: turn.dayWeek,
              month: turn.month,
              hour: turn.hour,
              minutes: turn.minutes,
              poll: turn.poll,
              rating: turn.rating,
              status: turn.status,
              commentCancel: turn.commentCancel,
              review: turn.review,
              height: summary[0]?.height,
              weight: summary[0]?.weight,
              temperature: summary[0]?.temperature,
              pressure: summary[0]?.pressure,
              name1: summary[0]?.name1,
              value1: summary[0]?.value1,
              name2: summary[0]?.name2,
              value2: summary[0]?.value2,
              name3: summary[0]?.name3,
              value3: summary[0]?.value3
            };
            combinedTurns.push(combinedTurn); 
          });
        });
        this.turns = combinedTurns; 
      });
    });
  }
  

  onClickAccepted(tuns: Turns) {
    this.modal.modalCancelConfirmMsg("¿Desea aceptar el turno?", "Se aceptará el turno", 'info', "aceptarlo").then((result) => {
      if (result.isConfirmed) {
        this.userService.updateTurns(tuns, '', 'Accepted');
        this.modal.modalSimple("Aceptado", "Se aceptó el turno correctamente", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.modal.modalSimple("Cancelado", "El turno no se modificó", "error");
      }
    })
  }
  onClickCanel(tuns: Turns) {
    this.modal.modalCancelConfirmMsg("¿Desea cancelar el turno?", "Se cancelará el turno", 'question', "cancelarlo").then((result) => {
      if (result.isConfirmed) {
        this.modal.modalInputTextCancel().then(res => {
          this.userService.updateTurns(tuns, res, 'Cancelled');
          this.modal.modalSimple("Cancelado", "Se canceló el turno correctamente", "success");
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.modal.modalSimple("Cancelado", "El turno está a salvo", "error");
      }
    })
  }

  onClickFinally(tuns: Turns, content: any) {
    this.modal.modalCancelConfirmMsg("¿Desea finalizar el turno?", "Se cerrará el turno", 'info', "finalizarlo").then((result) => {
      if (result.isConfirmed) {
        if (!tuns.review) {
          this.modal.modalInputText("Reseña", "Ingrese su comentario", "reseña").then(res => {
            this.userService.updateTurnsReview(tuns, res);
            this.modal.modalSimple("Guardado", "Se guardó correctamente su reseña", "success");
            this.turnSelected = tuns;
            this.modalService.open(content);
          })
        }else{
          this.turnSelected = tuns;
          this.modalService.open(content);
        }
      
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.modal.modalSimple("Cancelado", "El turno queda pendiente de terminar", "error");
      }
    })
  }

  onClickRefused(tuns: Turns) {
    this.modal.modalCancelConfirmMsg("¿Desea rechazar el turno?", "Se rechazará el turno", 'question', "rechazarlo").then((result) => {
      if (result.isConfirmed) {
        this.modal.modalInputTextCancel().then(res => {
          this.userService.updateTurns(tuns, res, 'Refused');
          this.modal.modalSimple("Rechazado", "Se rechazó el turno correctamente", "success");
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.modal.modalSimple("Cancelado", "El turno está a salvo", "error");
      }
    })
  }

  onClickShowPoll(tuns: Turns) {
    this.modal.modalMessageOk(tuns.poll ?? 'Sin datos', 'info');
  }

  onClickPoll(tuns: Turns) {
    this.modal.modalInputText("Encuesta", "Ingrese su comentario", "encuenta").then(res => {
      this.userService.updateTurnsPoll(tuns, res);
      this.modal.modalSimple("Guardado", "Se guardó correctamente su encuesta", "success");
    })
  }

  onClickShowReview(tuns: Turns) {
    this.modal.modalMessageOk(tuns.review ?? 'Sin datos', 'info');
  }

  onClickReview(tuns: Turns) {
    this.modal.modalInputText("Reseña", "Ingrese su comentario", "reseña").then(res => {
      this.userService.updateTurnsReview(tuns, res);
      this.modal.modalSimple("Guardado", "Se guardó correctamente su reseña", "success");
    })
  }

  info() {
  }

}
