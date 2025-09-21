import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { createAccountInfo } from "../utils/accountUtils";

export interface UserRegistrationData {
  name: string;
  email: string;
  age: number;
  profession: string;
  experience: number;
  sector: string;
  salary: number;
  additionalIncome: number;
}

export class UserService {
  static async saveCreditApplication(
    userId: string,
    applicationData: {
      amount: number;
      term: number;
      monthlyPayment: number;
      totalPayment: number;
      totalInterest: number;
      decision: any;
    }
  ): Promise<void> {
    try {
      const applicationRef = collection(db, "credit_applications");
      await addDoc(applicationRef, {
        userId,
        ...applicationData,
        applicationDate: new Date(),
        status: "processed",
      });
    } catch (error) {
      console.error("Error saving credit application:", error);
      throw new Error("Kredi başvurusu kaydedilemedi");
    }
  }

  static async saveApprovalDocument(
    userId: string,
    approvalData: {
      amount: number;
      term: number;
      monthlyPayment: number;
      decision: any;
    }
  ): Promise<void> {
    try {
      const docRef = doc(db, "loan_approvals", `${userId}_${Date.now()}`);
      await setDoc(docRef, {
        userId,
        ...approvalData,
        approvalDate: new Date(),
        status: "approved",
      });
    } catch (error) {
      console.error("Error saving approval document:", error);
      throw new Error("Onay belgesi kaydedilemedi");
    }
  }

  static prepareRegistrationData(formData: {
    age: string;
    profession: string;
    experience: string;
    sector: string;
    salary: string;
    additionalIncome: string;
  }) {
    return {
      age: parseInt(formData.age),
      profession: formData.profession,
      experience: parseInt(formData.experience) || 0,
      sector: formData.sector,
      salary: parseInt(formData.salary) || 0,
      additionalIncome: parseInt(formData.additionalIncome) || 0,
      account: createAccountInfo(),
    };
  }
}
