import {Component} from '@angular/core';
import {AlertController, NavController} from "ionic-angular";
import {HttpClient} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {BehaviorSubject} from "rxjs";
import {Hotspot} from '@ionic-native/hotspot';

interface StorageItem {
    key: string,
    name: string
}

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    hide: boolean = true;
    test: Array<StorageItem>;
    selectButton = [];
    items = [];
    buttons = [];
    triggerButton = [];
    public testTimer = 0;

    constructor(public navCtrl: NavController, public http: HttpClient, public alertCtrl: AlertController, private storage: Storage,private hotspot: Hotspot) {
        for (let i = 1; i <= 48; i++) {
            this.buttons.push({
                'trigger': i,
                'color': new BehaviorSubject<boolean>(false)
            });
        }
        this.test = [];
        this.storage.forEach((value) => {
            this.test.push(value);
        });
    }

    connectWifi(){
        this.hotspot.connectToWifi('VuurwerkServer', 'K31Cr3at10n5').then( () => {
            let alert = this.alertCtrl.create({
                title: 'Connected succesfully',
                subTitle: 'You are connected to the VuurwerkServer',
                buttons: ['OK']
            });
            alert.present();
        }).catch( () => {
            let alert = this.alertCtrl.create({
                title: 'Connecting Failed',
                subTitle: 'Out of reach / System Problem',
                buttons: ['OK']
            });
            alert.present();
        });
    }

    refreshShows() {
        this.test = [];
        this.storage.forEach((value) => {
            this.test.push(value);
        });
        console.log(this.test);
    }

    confirmPlay() {
        let alert = this.alertCtrl.create({
            title: 'Play show',
            message: 'Are you sure you want to play this show?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        this.playShow();
                    }
                }
            ]
        });
        alert.present();
    }

    playShow() {
        if (this.items.length != 0) {
            this.http.post('http://192.168.4.1:8000/go', JSON.stringify(this.items))
                .subscribe(data => {
                    console.log(data);
                });
            this.loopIndex();
        }
        else {
            const alert = this.alertCtrl.create({
                title: 'No show',
                subTitle: "You didn't select a show",
                buttons: ['OK']
            });
            alert.present();
        }
    }

    showItems(i) {
        this.items = JSON.parse(JSON.stringify(this.test[i][0].show));
    }

    deleteShow(i) {
        console.log(this.test);
        this.storage.remove(this.test[i][0].name);
        this.test = [];
        this.storage.forEach((value) => {
            this.test.push(value);
        });
        console.log(this.test);
        this.items = [];
    }

    triggerButtons(i) {
        this.buttons[i].color = !this.buttons[i].color;
        if (!this.buttons[i].color) {
            let value = this.buttons[i].trigger;
            this.triggerButton.push({
                "type": "Trigger",
                "data": {
                    "value": value
                }
            });
            this.http.post('http://192.168.4.1:8000/go', JSON.stringify(this.triggerButton))
                .subscribe(data => {
                    console.log(data);
                });
            this.triggerButton = [];
            this.selectButton = [];
        }
    }

    loopIndex() {
        if (this.items.length != 0) {
            if (this.items[0].type === 'Trigger') {
                this.items.splice(0, 1);
                this.loopIndex();
            }
            else {
                this.testTimer = this.items[0].data.value;
                let intervalVar = setInterval(function () {
                    this.testTimer -= 100;
                    if (this.testTimer <= 0) {
                        clearInterval(intervalVar);
                        this.items.splice(0, 1);
                        this.loopIndex();
                    }
                }.bind(this), 100);
            }
        }
        else {
            this.testTimer = 0;
            const alert = this.alertCtrl.create({
                title: 'Show is over',
                subTitle: "Your show has ended",
                buttons: ['OK']
            });
            alert.present();
        }
    }

    hideButtons(): void {
        this.hide = !this.hide;
    }

    goToMyPage() {

        this.navCtrl.push('ShowPage');
    }
}

