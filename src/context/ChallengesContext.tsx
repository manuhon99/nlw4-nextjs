import { createContext, ReactNode, useState } from 'react';
import challenges from '../../challenges.json';

interface ChallengesProviderProps{
	children: ReactNode;
}

interface Challenge{
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengesContextData{
  level: number; 
  currentExperience: number; 
  challengesCompleted: number; 
  experienceToNextLevel: number; 
  activeChallenge: Challenge;
  levelUp: () => void, 
  startNewChallenge: () => void;
  resetChallenge: () => void;
}


export const ChallengesContext = createContext({} as ChallengesContextData);


export function ChallengesProvider({ children }: ChallengesProviderProps){
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    //calculo rpg em potencia, 4 é o fator de xp
    const experienceToNextLevel = Math.pow((level+1)*4,2);

    const [activeChallenge, setActiveChallenge] = useState(null)

    function levelUp(){		
      setLevel(level+1)
    }

    function startNewChallenge(){
      //número aleatório de acordo com o numedo de desafios no json
      const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
      const challenge = challenges[randomChallengeIndex]

      setActiveChallenge(challenge)
    }

    function resetChallenge(){
      setActiveChallenge(null);
    }


    return(
        <ChallengesContext.Provider value={{level, currentExperience, challengesCompleted, levelUp, startNewChallenge, activeChallenge, resetChallenge, experienceToNextLevel}}>
					{ children }
        </ChallengesContext.Provider>
    )
}