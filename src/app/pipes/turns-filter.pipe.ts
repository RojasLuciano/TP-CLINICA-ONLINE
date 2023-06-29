import { Pipe, PipeTransform } from '@angular/core';
import { Turns } from '../entities/turns';

@Pipe({
  name: 'turnsFilter'
})
export class TurnsFilterPipe implements PipeTransform {

  transform(items: Turns[], keyword: any, properties: string[]): Turns[] {
    if (!items) return [];
    if (!keyword) return items;
    //debugger;
    return items.filter(item => {
      var itemFound: Boolean = false;
      for (let i = 0; i < properties.length; i++) {
        if (item.specialist!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }
        if (item.specialty!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }
        if (item.nameDate!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.status!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.height != undefined && item.height!.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.weight != undefined && item.weight!.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.temperature != undefined && item.temperature!.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.pressure != undefined && item.pressure!.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.name1 != undefined && item.name1!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.value1 != undefined && item.value1!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.name2 != undefined && item.name2!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.value2 != undefined && item.value2!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.name3 != undefined && item.name3!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }

        if (item.value3 != undefined && item.value3!.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }











      }
      return itemFound;
    });
  }
}