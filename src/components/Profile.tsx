import { useContext } from 'react';
import { ChallengesContext } from '../context/ChallengesContext';
import styles from '../styles/components/Profile.module.css'
export function Profile(){

  const { level } = useContext(ChallengesContext)
  return(
    <div className={styles.profileContainer}>
      <img src="http://github.com/manuhon99.png" alt="Emanueli"></img>
  
      <div>
        <strong>Emanueli Silva</strong>
        <p>
					<img src="icons/level.svg" alt="Level"/>
					Level {level}</p>
      </div>
    </div>
  );
}