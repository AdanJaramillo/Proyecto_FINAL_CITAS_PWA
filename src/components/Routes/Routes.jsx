import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import AppBar from '../../components/AppBar';
 import { Routes , Route } from "react-router-dom";
import Account from "../Account";
import Cita from "../Cita";
import Inicio from "../Inicio";
import NewCita from "../NewCita";
import Calendario from "../Calendario";



export default function Rutas({ session }) {
    const [, setLoading] = useState(true);
    const [, setUsername] = useState(null);
    const [, setWebsite] = useState(null);
    const [, setAvatarUrl] = useState(null);
    const [, setnombrepaciente] = useState(null);
    const [, setfecharegistro] = useState(null);
    const [, setfechacita] = useState(null);
    const [, setContenido] = useState(null);
    

    useEffect(() => {
        getAccount();
        getCita();
    }, []);


    async function getAccount() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data, error, status } = await supabase
                .from("profiles")
                .select(`username, website, avatar_url`)
                .eq("id", user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function getCita() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data, error, status } = await supabase
                .from("cita")
                .select(`nombrepaciente, fecharegistro, contenido, fechacita `)
                .eq("id", user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setnombrepaciente(data.nombrepaciente);
                setfecharegistro(data.fecharegistro);
                setContenido(data.contenido);
                setfechacita(data.fechacita);
               console.log(data);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

   

    return (
        
        <div className="form-widget">
         <AppBar/>

           
            <Routes>
                        <Route path='/Account' element={<Account key={session.user.id} session={session}  />}/>
                        <Route path='/Cita/:id' element={<Cita key={session.user.id} session={session}  />}/>
                        <Route path='/NewCita' element={<NewCita key={session.user.id} session={session}/>}/>
                        <Route path='/Calendario' element={<Calendario key={session.user.id} session={session}/>}/>
                        <Route path='/' element={<Inicio key={session.user.id} session={session}/>}/>
            </Routes>

        </div>
    );
}