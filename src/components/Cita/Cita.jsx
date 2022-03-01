import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import AppBar from '../AppBar';
import { Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Cita({ session }) {
    const [loading, setLoading] = useState(true);
    const {id}=useParams();
    const [state, setState] = useState({id:'', nombrepaciente:'', fecharegistro:'', contenido:'', fechacita:'' });
    const handleChange = ({target}) => {setState({...state, [target.name]: target.value})}; 
    const navigate = useNavigate();
    

    useEffect(() => {
        getCita();
        return () => {}
    }, []);

    
    async function getCita() {
        try {
            setLoading(true);

            let { data, error, status } = await supabase
                .from("cita")
                .select(`id_user, id, nombrepaciente, fecharegistro, contenido, fechacita `)
                .eq("id", id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) { setState(data)
                
               console.log(data);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    const EditarCita = async () =>  { 
        try {
            setLoading(true);

            const update = {...state, updated_at: new Date()};

            let { error } = await supabase.from("cita").upsert( update )

            if (error) {
                throw error;
            }
            navigate('/');
            
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

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    value={session.user.email}
                    disabled
                />
            </div>
            <div>
                <label htmlFor="nombrepaciente">Name</label>
                <input name="nombrepaciente"
                    id="nombrepaciente"
                    type="text"
                    value={state.nombrepaciente || "" }
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="fecharegistro">Fecha Creacion</label>
                <input name="fecharegistro"
                    id="fecharegistro"
                    type="Date"
                    value={state.fecharegistro || ""}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="contenido">Contenido</label>
                <input name="contenido"
                    id="contenido"
                    type="text"
                    value={state.contenido || ""}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="fechacita">Fecha Recordatorio</label>
                <input name="fechacita"
                    id="fechacita"
                    type="Date"
                    value={state.fechacita || ""}
                    onChange={handleChange}
                />
            </div>
           

            <div>
                <Button
                    className="button block primary"
                    onClick={ 
                        EditarCita
                    }
                    disabled={loading}
                >
                    <Link to="/">
                    {loading ? "Loading ..." : "Update"}
                    </Link>
                </Button>
            </div>                   
            
        </div>
    );
}
