import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collectionData, Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { ScheduleManagement } from '../entities/schedule-management';
import { Specialty } from '../entities/specialty';
import { User } from '../entities/user';
import { RoleValidator } from '../helpers/role-validator';
import { Turns } from '../entities/turns';
import firebase from 'firebase/compat/app';
import { Summary } from '../entities/summary';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends RoleValidator {
  public user = new User();
  public isLogged = false;
  public userLogged: User | any;

  constructor(private afs: AngularFirestore, private firestore: Firestore) {
    super();
  }

  async addUser(user: User) {
    let newUser: User = {
      email: user.email,
      password: user.password,
      displayName: user.name,
      photoURL: user.photoURL,
      name: user.name,
      lastName: user.lastName,
      age: user.age,
      dni: user.dni,
      socialWork: user.socialWork,
      imageUrl: user.imageUrl,
      specialty: user.specialty,
      enable: user.enable,
      role: user.role,
      uid: user.uid,
      registerAdmin: user.registerAdmin
    };
    return await this.afs.collection('users').add(newUser);
  }

  async getUsers(user: any) {
    const pattientRef = collection(this.firestore, 'users');
    const q = query(pattientRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      return doc.data();
    });
  }

  getUserAllPatient(): Observable<User[]> {
    const pattientRef = collection(this.firestore, 'users');
    const q = query(pattientRef, where("role", "==", "Patient"));
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }

  getUserId(userUid: any): Observable<User[]> {
    const pattientRef = collection(this.firestore, 'users');
    const q = query(pattientRef, where("uid", "==", userUid));
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }

  getUserEmail(email: any, collectionName: string): Observable<User[]> {
    const pattientRef = collection(this.firestore, collectionName);
    const q = query(pattientRef, where("email", "==", email));
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }



  getUserAll(): Observable<User[]> {
    const userRef = collection(this.firestore, 'users');
    return collectionData(userRef, { idField: 'id' }) as Observable<User[]>;
  }

  deleteUser(user: User) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userDocRef);
  }

  approveUser(user: User) {
    const patientRef = this.afs.collection('users');
    patientRef.doc(user.id).update({ enabled: true });
  }

  updateUser(user: User, status: boolean) {
    const placeRef = doc(this.firestore, `users/${user.id}`);
    return updateDoc(placeRef, { enable: status });
  }

  updateUserUid(user: User, uid: string) {
    const placeRef = doc(this.firestore, `users/${user.id}`);
    return updateDoc(placeRef, { uid: uid, registerAdmin: false });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return (user !== null) ? true : false;
  }

  // Schedule
  async addSchedule(schedule: ScheduleManagement) {
    let newSchedule: ScheduleManagement = {
      specialist: schedule.specialist,
      specialty: schedule.specialty,
      timeShift: schedule.timeShift,
      schedule: schedule.schedule,
    }
    return await this.afs.collection('schedules').add(newSchedule);
  }

  getScheduleId(userUid: any): Observable<ScheduleManagement[]> {
    const pattientRef = collection(this.firestore, 'schedules');
    const q = query(pattientRef, where("specialist", "==", userUid));
    return collectionData(q, { idField: 'id' }) as Observable<ScheduleManagement[]>;
  }

  updateSchule(user: ScheduleManagement, change: ScheduleManagement) {
    const placeRef = doc(this.firestore, `schedules/${user.id}`);
    return updateDoc(placeRef, { schedule: change.schedule, timeShift: change.timeShift });
  }

  //Specialty
  async addSpecialty(specialty: Specialty) {
    let newSpecialty: Specialty = {
      name: specialty.name,
    }
    return await this.afs.collection('specialty').add(newSpecialty);
  }

  getSpecialtyName(name: string): Observable<Specialty[]> {
    const pattientRef = collection(this.firestore, 'specialty');
    const q = query(pattientRef, where("name", "==", name));
    return collectionData(q, { idField: 'id' }) as Observable<Specialty[]>;
  }

  getSpecialtyAll(): Observable<Specialty[]> {
    const userRef = collection(this.firestore, 'specialty');
    return collectionData(userRef, { idField: 'id' }) as Observable<Specialty[]>;
  }

  //Turns
  async addTurn(turn: Turns) {
    console.log(turn);
    let newTurn: Turns = {
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
      status: turn.status,
    }
    return await this.afs.collection('turns').add(newTurn);
  }

  getReservedTurns(specialist: User) {
    const data: Turns[] = [];
    return firebase
      .firestore()
      .collection('turns')
      .where('specialistUid', '==', specialist.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getAllReservedTurns() {
    const data: Turns[] = [];
    return firebase
      .firestore()
      .collection('turns')
      .where('status', '==', 'Reserved')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getFinallyTurns(patient: User) {
    const data: Turns[] = [];
    return firebase
      .firestore()
      .collection('turns')
      .where('patientUid', '==', patient.uid)
      .where('status', '==', 'Finalized')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getAll_Turns(patient: User) {
    const data: Turns[] = [];
    return firebase
      .firestore()
      .collection('turns')
      .where('patientUid', '==', patient.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getAllFinallyTurns() {
    const data: Turns[] = [];
    return firebase
      .firestore()
      .collection('turns')
      .where('status', '==', 'Finalized')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getAllFinallyTurnsBySpecialist(especialista: string) {
    const data: Turns[] = [];
    return firebase
      .firestore()
      .collection('turns')
      .where('specialist', '==', especialista)
      .where('status', '==', 'Finalized')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }



  getAllFinallyTurnsWithTime(fechaInicio: string, fechaFin: string, especialista: string) {
    const data: Turns[] = [];
    const fechaInicioday = parseInt(fechaInicio.substring(0, 2));
    const fechaInicioPartsmonth = parseInt(fechaInicio.substring(3, 5));
   
    const fechaInicioday2 = parseInt(fechaFin.substring(0, 2));
    const fechaInicioPartsmonth2 = parseInt(fechaFin.substring(3, 5));
  
    console.log("fechaInicioday", fechaInicioday);
    console.log("fechaInicioPartsmonth", fechaInicioPartsmonth);
  
    console.log("fechaInicioday2", fechaInicioday2);
    console.log("fechaInicioPartsmonth2", fechaInicioPartsmonth2);
  
    return firebase
      .firestore()
      .collection('turns')
      .where('specialist', '==', especialista)
      .where('day', '>=', fechaInicioday)
      .where('month', '>=', fechaInicioPartsmonth)
      .where('day', '<=', fechaInicioday2)
      .where('month', '<=', fechaInicioPartsmonth2)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }
  
  
  splitDate(date: Date) {
    const dateString = date.toString();
    const [_, month, day] = dateString.split(' ');
  
    return { day, month };
  }
  

  getAllTurns() {
    const data: Turns[] = [];
    return firebase
      .firestore()
      .collection('turns')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }



  getTurnsAll(): Observable<Turns[]> {
    const userRef = collection(this.firestore, 'turns');
    return collectionData(userRef, { idField: 'id' }) as Observable<Turns[]>;
  }

  updateTurns(turn: Turns, msg: string, status: string) {
    const placeRef = doc(this.firestore, `turns/${turn.id}`);
    return updateDoc(placeRef, { status: status, commentCancel: msg });
  }

  updateTurnsFinnally(turn: Turns, status: string) {
    const placeRef = doc(this.firestore, `turns/${turn.id}`);
    return updateDoc(placeRef, { status: status });
  }

  updateTurnsReview(turn: Turns, msg: string) {
    const placeRef = doc(this.firestore, `turns/${turn.id}`);
    return updateDoc(placeRef, { review: msg });
  }
  updateTurnsRating(turn: Turns, msg: string) {
    const placeRef = doc(this.firestore, `turns/${turn.id}`);
    return updateDoc(placeRef, { rating: msg });
  }

  updateTurnsPoll(turn: Turns, msg: string) {
    const placeRef = doc(this.firestore, `turns/${turn.id}`);
    return updateDoc(placeRef, { poll: msg });
  }

  //Summary
  async addSummary(summary: Summary, turn: Turns) {
    let newUser: Summary = {
      height: summary.height,
      weight: summary.weight,
      temperature: summary.temperature,
      pressure: summary.pressure,
      name1: summary.name1 ?? '',
      value1: summary.value1 ?? '',
      name2: summary.name2 ?? '',
      value2: summary.value2 ?? '',
      name3: summary.name3 ?? '',
      value3: summary.value3 ?? '',
      name4: summary.name4 ?? '',
      value4: summary.value4 ?? '',
      name5: summary.name5 ?? '',
      value5: summary.value5 ?? '',
      name6: summary.name6 ?? '',
      value6: summary.value6 ?? '',
      patientUid: turn.patientUid,
      specialistUid: turn.specialistUid,
      turnUid: turn.id,
      specialty: turn.specialty,
      specialist: turn.specialist,
      patient: turn.patient,
      date: new Date(),
    };
    return await this.afs.collection('summary').add(newUser);
  }

  getSumariId(userUid: string, typeUser: string): Observable<Summary[]> {
    const pattientRef = collection(this.firestore, 'summary');
    const q = query(pattientRef, where(typeUser, "==", userUid));
    return collectionData(q, { idField: 'id' }) as Observable<Summary[]>;
  }

  getTurnId(userUid: string, typeUser: string): Observable<Turns[]> {
    const pattientRef = collection(this.firestore, 'turns');
    const q = query(pattientRef, where(typeUser, "==", userUid));
    return collectionData(q, { idField: 'id' }) as Observable<Turns[]>;
  }

  getSummaryTurnId(userUid: string) {
    const data: Summary[] = [];
    return firebase
      .firestore()
      .collection('summary')
      .where('turnUid', '==', userUid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getSummaryTurnId2(userUid: string): Promise<Summary[]> {
  const data: Summary[] = [];
  return firebase
    .firestore()
    .collection('summary')
    .where('turnUid', '==', userUid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
      return []; 
    });

  }

  async addTurnsToUser(users: User[], turn: Turns[]) {
    let empty: Turns[] = [];
    return await users.forEach(user => {
      let turnExit: Turns[] = [];
      let newTurns: Turns[] = turn.filter(fill => fill.patientUid == user.uid).sort((a, b) => {
        if (a.nameDate! < b.nameDate!) {
          return 1;
        }
        if (a.nameDate! > b.nameDate!) {
          return -1;
        }
        return 0;
      });

      for (let index = 0; index < 3; index++) {
        if (newTurns.length > index) {
          const element = newTurns[index];
          if (element.status == 'Finalized') {
            turnExit.push(element);
          }
        }
      }

      const placeRef = doc(this.firestore, `users/${user.id}`);
      updateDoc(placeRef, { turns: empty }).then(() => {
        updateDoc(placeRef, { turns: turnExit });
      })
    })
  }


  getLogsAll(): Observable<any[]> {
    const userRef = collection(this.firestore, 'logs');
    return collectionData(userRef, { idField: 'id' }) as Observable<any[]>;
  }

  getUserAllSpecialist(): Observable<User[]> {
    const pattientRef = collection(this.firestore, 'users');
    const q = query(pattientRef, where("role", "==", "Specialist"));
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }


  getTurnsBySpecialist(patientUid: string, specialistUid: string): Observable<User[]> {
    const pattientRef = collection(this.firestore, 'turns');
    const q = query(pattientRef, where("patientUid", "==", patientUid), where("specialistUid", "==", specialistUid));
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }


  
  


    


}
