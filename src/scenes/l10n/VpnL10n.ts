import {Scene} from "../../model/scene-types";

export interface VpnL10n {
  getText(scene: Scene): string
  
  //navigation
  goToMainMenu():string
  goToIphoneInstruction():string
  goToMacInstruction():string
  goToAndroidInstruction():string
  goToWindowsInstruction():string
  goToGeneralInfo():string
  goToGetConfigs():string
  goToFeedback():string
  goToReservationNow():string
  goToReservationByDate():string
  goToInstruction():string
  goToDeleteMyReservation():string
  goToDateSlot1(scene: Scene):string
  goToDateSlot2(scene: Scene):string
  goToDateSlot3(scene: Scene):string
  goToTimeSlot1(scene: Scene):string
}