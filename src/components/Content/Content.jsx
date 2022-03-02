import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CardActions } from '@mui/material';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { supabase } from "../../config/supabaseClient";




export default function MultiActionAreaCard({ id, nombrepaciente, fecharegistro, contenido, fechacita, avatar_url}) {

  const [url,setURL] = useState(null);

  useEffect(() => {
  downloadImage(avatar_url)}, []);
  
  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('pacientes').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setURL(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }
  


  const { t } = useTranslation();


  
  
  return (
    <Card sx={{ display: 'flex', height:"auto", width:800 }}>
    
      <CardActions>    
        <CardContent sx={{ fontSize: 14 }} color="text.secondary">
        <Typography variant="body2" color="red">
          {t("IMG")}
            <Typography variant="body2" color="Black">

             <img src={url} alt="avatar_url" 
          alt="Avatar"
          className="avatar image"
          style={{ height: "128px" , width: "128px"  }}/> 
              </Typography>
          </Typography>
          
          <Typography gutterBottom variant="body2" component="div" color="red">
          {/* color="text.secondary" */}
          {t("NAME OF PATIENT")}
            <Typography variant="body2" color="Black">
              {nombrepaciente} 
              </Typography>
          </Typography>
          
          <Typography gutterBottom variant="body2" component="div" color="red">
          {t("SYMPTOM")}
            <Typography variant="body2" color="Black">
              {contenido} 
              </Typography>
          </Typography>

          <Typography variant="body2" color="red">
          {t("REGISTRATION DATE")}
            <Typography variant="body2" color="Black">
              {fecharegistro} 
              </Typography>
          </Typography>
          <Typography variant="body2" color="red">
          {t("DAY OF THE APPOINTMENT")}
            <Typography variant="body2" color="Black">
              {fechacita} 
              </Typography>
          </Typography> 
          
        </CardContent>
      </CardActions>
      
        
    </Card>
   
  );
}




