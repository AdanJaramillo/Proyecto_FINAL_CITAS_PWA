import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CardActions } from '@mui/material';
import { useTranslation } from "react-i18next";


export default function MultiActionAreaCard({ id, nombrepaciente, fecharegistro, contenido, fechacita}) {


  const { t } = useTranslation();
  
  return (
    <Card sx={{ display: 'flex', height:250, width:800 }}>
    
      <CardActions>    
        <CardContent sx={{ fontSize: 14 }} color="text.secondary">
          
          <Typography gutterBottom variant="body2" component="div" color="red">
          {/* color="text.secondary" */}
          {t("NAME")}
            <Typography variant="body2" color="Black">
              {nombrepaciente} 
              </Typography>
          </Typography>
          
          <Typography gutterBottom variant="body2" component="div" color="red">
          {t("CONTENT")}
            <Typography variant="body2" color="Black">
              {contenido} 
              </Typography>
          </Typography>

          <Typography variant="body2" color="red">
          {t("CREATION DATE")}
            <Typography variant="body2" color="Black">
              {fecharegistro} 
              </Typography>
          </Typography>
          <Typography variant="body2" color="red">
          {t("REMINDER DATE")}
            <Typography variant="body2" color="Black">
              {fechacita} 
              </Typography>
          </Typography>
        </CardContent>
      </CardActions>
      
        
    </Card>
   
  );
}


