import { useState} from "react";
import { supabase } from "../../config/supabaseClient";
import AppBar from '../AppBar';
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";




export default function CitaAdd({session}) {
    // const [id, setid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nombrepaciente, setnombrepaciente] = useState(null);
    const [fecharegistro, setfecharegistro] = useState(null);
    const [contenido, setContenido] = useState(null);
    const [fechacita, setfechacita] = useState(null);
   
    


    async function AgregarCita({ nombrepaciente, fecharegistro, contenido, fechacita  }) {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            const Agregar = {
                
                nombrepaciente, 
                fecharegistro, 
                contenido, 
                fechacita,
                updated_at: new Date(),
                id_user:user.id,
            };

                
            let { error } = await supabase.from("cita").upsert(Agregar,  {
                returning: "minimal", // Don't return the value after inserting
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        
        <div>
                <Box>
         <AppBar/> 
         
            <div>
                <label htmlFor="email">Profile</label>
                <input
                    id="email"
                    type="text"
                    value={session.user.email}
                    disabled
                />
            </div>
            <div>
                <label htmlFor="nombrepaciente">NAME OF PATIENT</label>
                <input
                    id="nombrepaciente"
                    type="text"
                    value={nombrepaciente || ""}
                    onChange={(e) => setnombrepaciente(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="fecharegistro">REGISTRATION DATE</label>
                <input
                    id="fecharegistro"
                    type="Date"
                    value={fecharegistro || ""}
                    onChange={(e) => setfecharegistro(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="contenido">SYMPTOM</label>
                <input
                    id="contenido"
                    type="text"
                    value={contenido ||""}
                    onChange={(e) => setContenido(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="fechacita">DAY OF THE APPOINTMENT</label>
                <input
                    id="fechacita"
                    type="Date"
                    value={fechacita || ""}
                    onChange={(e) => setfechacita(e.target.value)}
                />
            </div>

            <div></div>
            

            <div>
                <Button
                    className="button block primary"
                    // value={id || ""}
                    onClick={() =>
                        AgregarCita({ nombrepaciente, fecharegistro, contenido, fechacita })
                    }
                    disabled={loading}
                >
                    <Link to="/">
                    {loading ? "Loading ..." : "Guardar"}
                    </Link>
                </Button>
            </div>   
            </Box>              
        </div>
      
    );
}