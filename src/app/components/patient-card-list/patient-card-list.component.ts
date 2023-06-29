import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoCard } from 'src/app/entities/info-card';
import { Summary } from 'src/app/entities/summary';
import { Turns } from 'src/app/entities/turns';
import { User } from 'src/app/entities/user';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-patient-card-list',
  templateUrl: './patient-card-list.component.html',
  styleUrls: ['./patient-card-list.component.scss']
})
export class PatientCardListComponent implements OnInit {

  @Input() users: User[] = [];
  @Input() turns: Turns[] = [];
  users1: User[] = [];
  turns1: Turns[] = [];
  userLogged = this.authService.getCurrentUser();
  specialist: string = '';
  textFill: string = '';
  turnSelected!: Turns;
  summarySelected!: Summary;

  constructor(private userService: UsersService, private authService: AuthService, private modalService: NgbModal, private modal: ModalService) { }

  ngOnInit(): void {
    this.userLogged.then((res) => {
      this.specialist = res?.uid!;
    });
  }

  count(turns: Turns[]): number {
    return turns.length;
  }

    
    onClickTurn(user: User, content: any) {
      console.log(user.id);
      this.userService.getTurnId(user.uid!, "patientUid").subscribe(turns => {
        this.turns1 = turns;
        this.modalService.open(content, { size: 'xl' });
        console.log(this.turns1);
      }
      )
    }


  onClickShowReview(tuns: Turns) {
    this.modal.modalMessageOk(tuns.review ?? 'Sin datos', 'info');
  }


}

