import { Component, OnInit } from '@angular/core';
import { Turns } from 'src/app/entities/turns';
import { UsersService } from 'src/app/services/users.service';
import { BarChart } from 'chartist';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-turns-fanally',
  templateUrl: './turns-fanally.component.html',
  styleUrls: ['./turns-fanally.component.scss']
})
export class TurnsFanallyComponent implements OnInit {
  elementRef: any;

  constructor(private userService: UsersService) { }

  turnRes: any;
  turnAll: Turns[] = [];
  dates: any = [];
  nombreEspecialista: string = '';


  data = {
    labels: [''],
    series: [[]]
  };

  options = {
    stackBars: true,
    colors: ['#f44336'],

  }

  ngOnInit(): void {
    // this.userService.getAllFinallyTurns().then(res => {
    //   this.turnRes = res;
    //   this.turnAll = [...this.turnRes];
    //   this.turnAll.forEach(turn => this.dates.push(turn.specialist));
    //   const result = this.dates.reduce((json: any, val: any) => ({ ...json, [val]: (json[val] | 0) + 1 }), {});
    //   let daysWeek = Object.keys(result);
    //   this.data.labels = [];
    //   daysWeek.forEach(res => {
    //     this.data.labels.push(res);
    //   })
    //   console.log(this.data.labels);
    //   this.data.series.push(Object.values(result));
    //   console.log(this.data.series);

    //   new BarChart('#chart2', this.data, this.options).on('draw', data => {
    //     if (data.type === 'bar') {
    //       data.element.attr({
    //         style: 'stroke-width: 300px'
    //       });
    //     }
    //   });
    // })
  }

  buscarTurnos() {

this.userService.getAllFinallyTurnsBySpecialist(this.nombreEspecialista).then(res => {


    this.userService.getAllFinallyTurns().then(res => {
      this.turnRes = res;
      this.turnAll = [...this.turnRes];
      this.turnAll.forEach(turn => this.dates.push(turn.specialist));
      const result = this.dates.reduce((json: any, val: any) => ({ ...json, [val]: (json[val] | 0) + 1 }), {});
      let daysWeek = Object.keys(result);
      this.data.labels = [];
      daysWeek.forEach(res => {
        this.data.labels.push(res);
      })
      console.log(this.data.labels);
      this.data.series.push(Object.values(result));
      console.log(this.data.series);

      new BarChart('#chart2', this.data, this.options).on('draw', data => {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 300px'
          });
        }
      });
    })
  })
}
      
    
  downloadData() {
    const chartElement = this.elementRef.nativeElement.querySelector('#chart2');

    html2canvas(chartElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('turnos-finalizados.pdf');
    }).catch((error) => {
      console.error('Error al convertir el gráfico en una imagen:', error);
    });
  }

}
