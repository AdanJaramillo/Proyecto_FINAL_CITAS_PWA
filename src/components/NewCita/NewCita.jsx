import { useState } from "react";
import { supabase } from "../../config/supabaseClient";
import AppBar from '../AppBar';
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";



export default function CitaAdd({ session }) {
    // const [id, setid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nombrepaciente, setnombrepaciente] = useState(null);
    const [fecharegistro, setfecharegistro] = useState(null);
    const [contenido, setContenido] = useState(null);
    const [fechacita, setfechacita] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);
    const [name_img, setNameImg] = useState(null);
    const [uploading, setUploading] = useState(false);

    async function uploadIMGACita(event) {
        try {
            setUploading(true)


            if (!event.target.files || event.target.files.length === 0) {

                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            setAvatarUrl(URL.createObjectURL(file))
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            setNameImg(fileName)
            const filePath = `${fileName}`

            let { error: uploadError } = await supabase.storage
                .from('pacientes')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
                console.log(uploadError)
            }

        } catch (error) {
            alert(error.message)
            setUploading(false)
        } finally {

        }
    }




    async function AgregarCita() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            //console.log(avatar_url)

            const Agregar = {

                nombrepaciente,
                fecharegistro,
                contenido,
                fechacita,
                updated_at: new Date(),
                avatar_url: name_img,
                id_user: user.id,
            };


            let { error } = await supabase.from("cita").upsert(Agregar, {
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
                <AppBar />

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
                        value={contenido || ""}
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
                <div>
                    <div>
                        {avatar_url ? (
                            <img
                                src={avatar_url}
                                alt="Avatar"
                                className="avatar image"
                                style={{ height: "128px", width: "128px" }}
                            />
                        ) : (
                            <div className="avatar no-image" style={{ height: "128px", width: "128px" }} />
                        )}
                        <div style={{ width: "128px" }}>
                            <label className="button primary block" htmlFor="single">
                                {'Upload'}
                            </label>
                            <input
                                style={{
                                    visibility: 'hidden',
                                    position: 'absolute',
                                }}
                                type="file"
                                id="single"
                                accept="image/*"
                                disable={uploading} onChange={uploadIMGACita}
                            />
                        </div>
                    </div>
                </div>

                <div></div>


                <div>
                    <Button
                        className="button block primary"
                        // value={id || ""}
                        onClick={
                            AgregarCita
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