import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile
  } from 'firebase/auth';
  import { auth } from '@/utils/firebase.browser';
  import { doc, setDoc } from 'firebase/firestore';
  import { db } from '@/utils/firebase.browser';
  
  export const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      if (user) {
        await updateProfile(user, { displayName });
        
        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName,
          createdAt: new Date()
        });
      }
      
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };
  
  export const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };
  
  export const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };
  
  export const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };