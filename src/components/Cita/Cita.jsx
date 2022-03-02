import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import AppBar from '../AppBar';
import { Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Cita({ session }) {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [state, setState] = useState({ id: '', nombrepaciente: '', fecharegistro: '', contenido: '', fechacita: '', avatar_url: '', });
    const handleChange = ({ target }) => { setState({ ...state, [target.name]: target.value }) };
    const navigate = useNavigate();
    const [url, setURL] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);
    const [name_img, setNameImg] = useState(null);
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        getCita();
        return () => { }
    }, []);


    async function getCita() {
        try {
            setLoading(true);

            let { data, error, status } = await supabase
                .from("cita")
                .select(`id_user, id, nombrepaciente, fecharegistro, contenido, fechacita, avatar_url `)
                .eq("id", id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                downloadImage(data.avatar_url); setState(data)
                console.log(data.avatar_url);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage.from('pacientes').download(path)
            if (error) {
                throw error
            }
            const url = URL.createObjectURL(data)
            console.log(url);
            setURL(url)
        } catch (error) {
            console.log('Error downloading image: ', error.message)
        }
    }

    const EditarCita = async () => {
        try {
            setLoading(true);

            const update = { ...state, updated_at: new Date(), avatar_url : name_img };

            let { error } = await supabase.from("cita").upsert(update)

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



    return (

        <div className="form-widget">
            <AppBar />


            <div>
                <div>
                    {url ? (
                        <img
                            src={avatar_url ? avatar_url : url}
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
                    value={state.nombrepaciente || ""}
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
