import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import moment from 'moment';
import 'moment/locale/es-mx';
import 'moment-timezone';


export default function Calendario({ session }) {
    const [state, setState] = useState(null);
    const user = supabase.auth.user();

    const DateFormat = (date) => {

        return moment(date).format('YYYY-MM-DD');

    }


    useEffect(() => {
        getCita();
        return () => { }
    }, []);

    async function getCita() {
        try {

            let { data, error, status } = await supabase
                .from("cita")
                .select(`id_user, id, nombrepaciente, fecharegistro, contenido, fechacita, avatar_url `)
                .in("id_user", [user.id])
                .in("status", [true])

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setState(data)
                console.log(data.avatar_url);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {

        }
    }

    return (
        state && (
            <DayPicker
              initialMonth={new Date(2022, 2)}
              selectedDays={state.map((item) => new Date(moment(item.fechacita)))}
            />
          )

    );
}