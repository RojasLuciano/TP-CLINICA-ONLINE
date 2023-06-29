import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { NumberOnlyDirective } from 'src/app/directives/number-only.directive';
import { Summary } from 'src/app/entities/summary';
import { User } from 'src/app/entities/user';
import { DayFormatPipe } from 'src/app/pipes/day-format.pipe';
import { FormatDayPipe } from 'src/app/pipes/format-day.pipe';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-summary-list',
  templateUrl: './summary-list.component.html',
  styleUrls: ['./summary-list.component.scss']
})
export class SummaryListComponent implements OnInit {

  public listSummary: Summary[] = [];
  public listSummarySmall: Summary[] = [];
  @Input() user!: User;
  isResume = true;
  textFill: string = '';
  listSpecialty: string[] = [];
  public specialists: any = [];

  constructor(private userService: UsersService, private modal: ModalService) { }

  // ngOnInit(): void {

  // }

  ngOnInit(): void {
    this.userService.getSumariId(this.user.uid!, 'patientUid').subscribe((users) => {
      this.listSummary = users;
      this.listSummarySmall = users;
      users.forEach(res => {
        if (!this.listSpecialty.find(srch => srch == res.specialty)) {
          this.listSpecialty.push(res.specialty!);
        }
      })
    })


    this.userService.getUserAllSpecialist().subscribe((users) => {
      this.specialists = users;
      this.specialists.forEach((specialist: any) => {
        console.log(specialist.name);
      })
    })
  }


  resume() {
    this.isResume = !this.isResume;
  }

  downloadSummary() {
    if (this.listSummary && this.listSummary.length > 0) {
      var line = 70;
      let PDF = new jsPDF('p', 'mm', 'a4');
      let pageHeight = PDF.internal.pageSize.height - 10;
  
      PDF.addImage('../../assets/icon.png', 'PNG', 10, 10, 50, 50);
      const date = new Date().toLocaleString();
  
      PDF.setFontSize(18);
      PDF.text('Clínica Online', 70, 20);
  
      PDF.setFontSize(10);
      PDF.text(date, 150, 10);
      PDF.text(`Historial de turnos de ${this.listSummary[0].patient}`, 70, 30);
  
      this.listSummary.forEach(turn => {
        let dayFormat = new FormatDayPipe().transform(turn);
  
        if (line > pageHeight) {
          PDF.addPage();
          line = 20;
        }
  
        PDF.setLineWidth(0.5);
        PDF.line(15, line - 5, 195, line - 5); 
  
        line += 10;
  
        PDF.text(`* Atendido por ${turn.specialist} el día ${dayFormat}`, 15, line);
        line += 10;
  
        PDF.text(`* Especialidad: ${turn.specialty}`, 15, line);
        line += 10;
  
        PDF.text(`* Altura: ${turn.height}`, 15, line);
        line += 10;
  
        PDF.text(`* Peso: ${turn.weight}`, 15, line);
        line += 10;
  
        PDF.text(`* Temperatura: ${turn.temperature}`, 15, line);
        line += 10;
  
        PDF.text(`* Presión: ${turn.pressure}`, 15, line);
        line += 10;
  
        const customFields = [
          { name: turn.name1, value: turn.value1 },
          { name: turn.name2, value: turn.value2 },
          { name: turn.name3, value: turn.value3 },
          { name: turn.name4, value: turn.value4 },
          { name: turn.name5, value: turn.value5 },
          { name: turn.name6, value: turn.value6 }
        ];
  
        customFields.forEach(field => {
          if (field.name) {
            if (line > pageHeight) {
              PDF.addPage();
              line = 20;
            }
  
            PDF.text(`* ${field.name}: ${field.value}`, 15, line);
            line += 10;
          }
        });
      });
  
      PDF.save('historia-clínica.pdf');
    } else {
      this.modal.modalMessage('El paciente no tiene historia clínica', 'error');
    }
  }
  





}
