import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpClientModule} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';


import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Hotspot} from "@ionic-native/hotspot";


@NgModule({
    declarations: [
        MyApp,
        HomePage,
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
    ],
    providers: [
        Hotspot,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
    ]
})
export class AppModule {
}
