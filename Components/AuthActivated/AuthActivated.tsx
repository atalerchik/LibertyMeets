import styles from './AuthActivated.module.scss'

export default function AuthActivated(){
  return(
    <div className={styles.container}>
      <h2 className={styles.codeMessage}>Error!</h2>
      <p className={styles.message}>
        Your account has been created, but in order to use it fully, you need to
        activate your email. We have sent a confirmation email to the address
        you provided. Please follow the instructions in the email to complete
        the activation process. If you have not received the email, please check
        your spam folder.
      </p>
    </div>
  )
}