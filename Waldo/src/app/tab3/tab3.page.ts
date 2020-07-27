import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { UserService } from '../_services/index';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../_services/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss']
})
export class Tab3Page implements OnInit {
  submitted: string = 'Your Form Has Been Submitted'
  firstName: string = 'Starter First Name'
  lastName: string = 'Starter Last Name'
  address: string = 'Starter Address'
  loggedIn: boolean; 
  username: string = ''
  password: string = ''

  userSubscription: Subscription;

  constructor(private userService: UserService, public alertController: AlertController, private http: HttpClient) {
    this.userSubscription = this.userService.onStatus().subscribe(status => {
      if (status[0] == "account"){
        this.loggedIn = status[1]
      } else if (status[0] == "registration"){
        this.loggedIn = status[1]
        this.firstName = status[2]
        this.lastName = status[3]
        this.address = status[4]
      } else {
        this.loggedIn = status[0]
      }
    })
  }

  processForm(): void {
    console.log(this.submitted)
    console.log(this.firstName + " " + this.lastName)
    if (this.firstName && this.lastName){
      this.logIn()
    } else {
      this.missingLogin()
    }
  }

  async logIn() {
    console.log("Recorded from Login:")
    console.log(this.username + " " + this.password)
    //Still experimenting with how to display the info that comes back from the server
    //this.http.get('https://localhost:5001/user').subscribe(
      //(data: Config[]) => this.api = data
    //)
    //this.http.get('https://localhost:5001/user/get/1',{responseType:'text'}).subscribe(
      //(data: string) => this.api2 = data
    //)

    const data: Config[] = await this.http.get<Config[]>('https://localhost:5001/user/').toPromise();
    console.log(data)
    
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type' : 'application/json'
    //   })
    // }

    // const data2 = await this.http.post<boolean>('https://localhost:5001/user/post', {"username":"asamee","password":"test5"}, httpOptions).toPromise();
    // console.log(data2)
    
    if (this.username && this.password){
      var match = false;
      var count = 0;
      while (!match && count < data.length){
        if (data[count]["username"] == this.username && data[count]["password"] == this.password){
          match = true
          this.firstName = data[count]["firstName"]
          this.lastName = data[count]["lastName"]
          this.address = data[count]["address"]
        }
        count = count + 1;
      }
      if (match){
        console.log("Match " + this.username)
        this.userService.sendStatus(["account", true]);
      } else {
        this.incorrectCredentials()
        console.log("Incorrect Credentials")
      }  
    } else {
      this.missingLogin()
    }
  }

  logOut(): void {
    this.username = ''
    this.password = ''
    this.firstName = ''
    this.lastName = ''
    this.address = ''
    this.userService.sendStatus(["account", false]);
  }

  ngOnInit() : void {
    this.userService.getStatus();
    console.log(this.loggedIn)
  }





  //ALERT BOXES
  async missingLogin() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Missing Fields',
      message: 'Username and Password are mandatory fields.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  //This is an alert box for when someone doesn't fill out the correct fields.
  async incorrectCredentials() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Incorrect Credentials',
      message: 'The Username and/or Password Fields are incorrect.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }
}
