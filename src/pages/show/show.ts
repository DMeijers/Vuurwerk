import { Component } from '@angular/core';
import {AlertController, IonicPage, reorderArray} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-show',
  templateUrl: 'show.html',
})
export class ShowPage {

    test = [];
    items = [];
    names = [];
    nameNumbers = [];
    delayList: number;
    public timer = 0;
    vuurwerkName: string;

    constructor(public http: HttpClient, public alertCtrl: AlertController, private storage: Storage) {
        for (let i = 1; i <= 48; i++) {
            this.names.push(i);
        }
    }

    confirmPlay() {
        let alert = this.alertCtrl.create({
            title: 'Confirm Show',
            inputs: [
                {
                    name: 'showname',
                    placeholder: 'Fill in your awesome name'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Confirm',
                    handler: data => {
                        this.vuurwerkName = data.showname;
                        this.startCountdown();
                    }
                }
            ]
        });
        alert.present();
    }
    addTrigger() {
        this.nameNumbers.forEach(value => {
            let nameValue = parseInt(value);
            this.names = this.names.filter(item => item !== nameValue);
            this.items.push({
                "type": "Trigger",
                "data": {
                    "value": nameValue
                }});
        });
    }

    addDelay() {
        if (this.delayList != null) {
            this.timer = this.timer + this.delayList * 1000;
            this.items.push({
                "type": "Delay",
                "data": {
                    "value": this.delayList * 1000
                }});
            this.delayList = null;
        }
        else {
            let alert = this.alertCtrl.create({
                title: 'Fill in delay',
                subTitle: "You didn't fill in any delay",
                buttons: ['OK']
            });
            alert.present();
        }
    }

    removeItem(item) {
        let index = this.items.indexOf(item);
        if (this.items[index].type === 'Delay') {
            this.timer = this.timer - this.items[index].data.value;
        }
        else {
            this.names.splice(0, 0, this.items[index].data.value);
            this.names.sort(function (a, b) {
                return a - b
            });
        }
        if (index > -1) {
            this.items.splice(index, 1);
            this.nameNumbers = [];
        }
    }
    reorderItems(indexes) {
        this.items = reorderArray(this.items, indexes);
    }

    startCountdown() {
        this.test.push({
            "show": this.items,
            "name": this.vuurwerkName
        });
        this.storage.set(this.vuurwerkName, this.test);
        console.log(this.storage.keys());
        this.names = [];
        this.items = [];
        this.nameNumbers = [];
        for (let i = 1; i <= 48; i++) {
            this.names.push(i);
        }
    }

}
