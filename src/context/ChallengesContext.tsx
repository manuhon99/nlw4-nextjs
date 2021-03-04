import { createContext, ReactNode, useEffect, useState } from 'react';
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
  completeChallenge: () => void;
}


export const ChallengesContext = createContext({} as ChallengesContextData);


export function ChallengesProvider({ children }: ChallengesProviderProps){
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    //calculo rpg em potencia, 4 é o fator de xp
    const experienceToNextLevel = Math.pow((level+1)*4,2);

    const [activeChallenge, setActiveChallenge] = useState(null)

    //efeito colateral, qd algo muda, ele executa a função
    //array vazio - executa a função uma única vez assim q o componente é exibido em tela
    useEffect(() => {
      Notification.requestPermission();
    },[])

    function levelUp(){		
      setLevel(level+1)
    }

    function startNewChallenge(){
      //número aleatório de acordo com o numedo de desafios no json
      const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
      const challenge = challenges[randomChallengeIndex]

      setActiveChallenge(challenge)

      new Audio('/notification.mp3').play();

      if (Notification.permission == 'granted'){
        new Notification('Novo desafio', {
          body: `Valendo ${challenge.amount} xp`
        })
      }
    }

    function resetChallenge(){
      setActiveChallenge(null);
    }

    function completeChallenge(){
      if(!activeChallenge){
        return;
      }

      const {amount} = activeChallenge;

      let finalExperience=currentExperience+amount;

      if(finalExperience >= experienceToNextLevel){
        finalExperience = finalExperience - experienceToNextLevel;
        levelUp();
      }

      setCurrentExperience(finalExperience);
      setActiveChallenge(null);
      setChallengesCompleted(challengesCompleted+1);

    }

    return(
        <ChallengesContext.Provider value={{level, currentExperience, challengesCompleted, levelUp, startNewChallenge, activeChallenge, resetChallenge, experienceToNextLevel, completeChallenge}}>
					{ children }
        </ChallengesContext.Provider>
    )
}