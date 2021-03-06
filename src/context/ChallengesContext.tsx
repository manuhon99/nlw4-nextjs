import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface ChallengesProviderProps{
	children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
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
  closeLevelUpModal: () => void;
}


export const ChallengesContext = createContext({} as ChallengesContextData);


export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps){
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 1);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 1);

    //calculo rpg em potencia, 4 é o fator de xp
    const experienceToNextLevel = Math.pow((level+1)*4,2);

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelUpModalOpen, setIsLevelModalOpen] = useState(false)

    //efeito colateral, qd algo muda, ele executa a função
    //array vazio - executa a função uma única vez assim q o componente é exibido em tela
    useEffect(() => {
      Notification.requestPermission();
    },[])

    useEffect(()=> {
      Cookies.set('level', String(level));
      Cookies.set('currentExperience', String(currentExperience));
      Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted])

    function levelUp(){		
      setLevel(level+1);
      setIsLevelModalOpen(true);
    }

    function closeLevelUpModal(){
      setIsLevelModalOpen(false)
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
        <ChallengesContext.Provider value={{level, currentExperience, challengesCompleted, levelUp, startNewChallenge, activeChallenge, resetChallenge, experienceToNextLevel, completeChallenge, closeLevelUpModal}}>
					{ children }
          {isLevelUpModalOpen && <LevelUpModal></LevelUpModal>}
        </ChallengesContext.Provider>
    )
}