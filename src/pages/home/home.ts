import { Component } from '@angular/core';
import { ToastController , NavController, ActionSheetController, LoadingController } from 'ionic-angular';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import * as Tesseract from 'tesseract.js'
import { NgProgress } from '@ngx-progressbar/core';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  selectedImage: string;
  imageText: string;
 
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private camera: Camera, private actionSheetCtrl: ActionSheetController, public progress: NgProgress) {
  }
 
  presentToast(textMessage) {
    let toast = this.toastCtrl.create({
      message: textMessage,
      duration: 1000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  selectSource() {    
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
 
  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = 'data:image/jpeg;base64,'+imageData;
    });
  }
 
  recognizeImage() {
    //this.presentToast("Recognize Image method started!")
    this.progress.start();
    Tesseract.recognize(this.selectedImage)
    .progress(message => {
      if (message.status === 'recognizing text'){
        this.progress.set(message.progress);
      }
        
    })
    .catch(err => {console.error(err)
      this.presentToast("Something went wrong: "+err);
    })
    .then(result => {
      this.imageText = result.text;
    })
    .finally(resultOrError => {
      this.progress.complete();
    });

    //this.presentToast("Recognize Image method ended!")
  }
 
}