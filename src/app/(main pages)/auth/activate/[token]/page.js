'use client'
import Loading from "@/components/modals/Loading";
import { InfoPopup, ErrorPopup } from "@/components/modals/Popups";
import { useEffect, useState } from "react";

export default function Activate(){

    const [isEmailSentSuccessfully, setEmailSentSuccessfully] = useState(null);
    const [isActivationSuccessful, setActivationSuccessful] = useState(null);

    const handleSendNewVerificationEmail = async (user) => {
        const response = await fetch(`/api/users`, { method: "PATCH",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({userId: user.id})
        });
        const result = await response.json();
        if (result.success){
            setEmailSentSuccessfully(true);
        }
        else{
            setEmailSentSuccessfully(false);
        }
    }

    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathname = url.pathname;
        const userEmailToken = pathname.split('/')[pathname.split('/').length - 1];

        const fetchUser = async() => {
            
            if(userEmailToken){
                const responseUser = await fetch(`/api/users?emailtoken=${userEmailToken}`);
                const resultUser = await responseUser.json();
                if (resultUser.success){
                    const user = resultUser.data;
                    const responseActivate = await fetch(`/api/users`, { method: "PATCH",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({id: user.id})
                    });
    
                    const resultActivate = await responseActivate.json();
                    if (resultActivate.success){
                        setActivationSuccessful(true);
                    }
                    else{
                        setActivationSuccessful(false); 
                    }
                    
                }
                else{
                    setActivationSuccessful(false);
                }
            }
            else{
                setActivationSuccessful(false);
            }
        }
        fetchUser();
    }, []);

    return(
        <>
            {isActivationSuccessful === null && isEmailSentSuccessfully === null && <Loading/>}
            {isActivationSuccessful && isEmailSentSuccessfully === null && <InfoPopup linkForButtonOkay={'/auth/sign-in'} pictureSource={'/images/congratulations.png'} text={'Тепер можете увійти у ваш акаунт та повноцінно користуватись ConnectedMinds. Дякуємо, що ви з нами!'} heading={'Ваш акаунт активовано'}/>}
            {isActivationSuccessful === null && isEmailSentSuccessfully && <ErrorPopup actionForButtonOkay={handleSendNewVerificationEmail} linkForButtonOkay={'/auth/sign-in'} pictureSource={'/images/error_cross.png'} text={'Схоже ваше активаційне посиланння вже застаріло. Перенадіслати вам його?'} heading={'Не вийшло активувати акаунт'}/>}
            {isActivationSuccessful === false && isEmailSentSuccessfully && <InfoPopup linkForButtonOkay={'/auth/sign-in'} pictureSource={'/images/checklist.png'} text={'Будь ласка, перевірте вашу електронну пошту'} heading={'Лист відправлено'}/>}
            {isActivationSuccessful === false && isEmailSentSuccessfully === false && <ErrorPopup linkForButtonOkay={'/auth/sign-in'} pictureSource={'/images/error_cross.png'} text={'Будь ласка, спробуйте пізніше'} heading={'Щось пішло не так...'}/>}

        </>
    );
}