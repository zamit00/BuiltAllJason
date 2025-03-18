let datanetunimKlaliXM=[];
const excludedKupaNames = ['ניהול אישי', 'IRA'];
const excludedOchlosiya = ['עובדי סקטור מסויים', 'עובדי מפעל/גוף מסויים'];
const excludedMozar = ['מטרה אחרת'];
const excludedMas = ['מבטיח תשואה'];


  window.onload = async function() {  
    fetchAllNetunim();
    //maslulim();
  }
  async function fetchAllNetunim(){
    await fetchkupotKlali();
    await fetchtsuaaHodshi();
    await fetchNechasim();
 }




async function fetchkupotKlali() {
    
  fetch('gemelKlali.xml')
  .then(response => response.text()) // מקבל את תוכן הקובץ כטקסט
  .then(xmlString => {
      const parser = new DOMParser(); 
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");
      const rows = xmlDoc.getElementsByTagName("Row");
      let colllen;
      let coll = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const mozar = row.getElementsByTagName("SUG_KUPA")[0]?.textContent ||  '';
        const shemkupa = row.getElementsByTagName("SHM_KUPA")[0]?.textContent || '';
        const yitratnehasim = row.getElementsByTagName("YITRAT_NCHASIM_LSOF_TKUFA")[0]?.textContent || 0;
        const divuach = row.getElementsByTagName("MATZAV_DIVUACH")[0]?.textContent ||  '';
        const ochlosiyayaad = row.getElementsByTagName("UCHLUSIYAT_YAAD")[0]?.textContent ||  '';
        const mhkupa = row.getElementsByTagName("ID")[0]?.textContent ||  '';
        const mas = row.getElementsByTagName("HITMAHUT_MISHNIT")[0]?.textContent ||  '';
        const masmishni=row.getElementsByTagName('HITMAHUT_MISHNIT')[0]?.textContent || '';
        const tesuam = row.getElementsByTagName("TSUA_MITZTABERET_LETKUFA")[0]?.textContent ||  0;
        const tesuam36 = row.getElementsByTagName("TSUA_MITZTABERET_36_HODASHIM")[0]?.textContent ||  0;
        const tesuam60 = row.getElementsByTagName("TSUA_MITZTABERET_60_HODASHIM")[0]?.textContent ||  0;
        const tarsiyum = row.getElementsByTagName("TAARICH_SIUM_PEILUT")[0]?.textContent ||  '';
        const menahelet = row.getElementsByTagName("SHM_HEVRA_MENAHELET")[0]?.textContent ||  '';
        const stiya36 = row.getElementsByTagName("STIAT_TEKEN_36_HODASHIM")[0]?.textContent ||  '';  
        const stiya60 = row.getElementsByTagName("STIAT_TEKEN_60_HODASHIM")[0]?.textContent ||  ''; 
        const hafkadot= row.getElementsByTagName("HAFKADOT_LLO_HAAVAROT")[0]?.textContent ||  0;
        const meshichot= row.getElementsByTagName("MSHICHOT_LLO_HAAVAROT")[0]?.textContent ||  0;
        const niyudNeto= row.getElementsByTagName("HAAVAROT_BEIN_HAKUPOT")[0]?.textContent ||  0;
        const zviraNeto= row.getElementsByTagName("TZVIRA_NETO")[0]?.textContent ||  0;
        const yitratNechasim= row.getElementsByTagName("YITRAT_NCHASIM_LSOF_TKUFA")[0]?.textContent ||  0;
        const dmeyNihul= row.getElementsByTagName("SHIUR_DMEI_NIHUL_AHARON")[0]?.textContent ||  0;
        const sharp= row.getElementsByTagName("SHARP_RIBIT_HASRAT_SIKUN")[0]?.textContent ||  0;


          if (
            divuach === "דווח" &&
            !excludedKupaNames.some(name => shemkupa.includes(name)) &&
            !excludedMozar.includes(mozar) &&
            !excludedMas.includes(mas) &&
            !tarsiyum &&
            Number(yitratnehasim) > 0
        ) {
          datanetunimKlaliXM.push({
            mh: mhkupa, 
            shemkupa: shemkupa, 
            mozar: mozar, 
            tesuam: Number(tesuam), 
            mas: mas, 
            masmishni:masmishni,
            yitra: yitratnehasim, 
            tesuam36: Number(tesuam36), 
            tesuam60: Number(tesuam60),
            menahelet: menahelet,
            stiya36: stiya36,
            stiya60: stiya60,
            ochlosiyayaad: ochlosiyayaad,
            hafkadot:hafkadot,
            meshichot:meshichot,
            niyudNeto:niyudNeto,
            zviraNeto:zviraNeto,
            yitratNechasim:yitratNechasim,
            dmeyNihul:dmeyNihul,
            sharp:sharp
          });

          
      }
      
      
      }
      
      
    
  })
  .catch(error => {
      console.error('Error:', error);
      return [];  // מחזירים מערך ריק במקרה של שגיאה
  });
}



async function fetchtsuaaHodshi() {
    
    fetch('gemelHodshi.xml')
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");
            const rows = xmlDoc.getElementsByTagName("Row");
    
            // אובייקט לאחסון את התשואות המצטברות
            const idKupaMap = {};
    
            // 1. עבור כל איבר ב-datanetunimKlali
            datanetunimKlaliXM.forEach(item => {
                const idKupa = item.mh;  
    
                // 2. סינון השורות לפי ה-ID_KUPA הנוכחי
                const rowsForIdKupa = Array.from(rows).filter(row => {
                    return row.getElementsByTagName("ID_KUPA")[0].textContent === idKupa;
                });
    
                var lastRow = rowsForIdKupa[rowsForIdKupa.length - 1];
                var tsuaNominaliBfoal = lastRow.getElementsByTagName("TSUA_NOMINALI_BFOAL")[0].textContent;


                let cumulativeReturn = 1;
                let startOfYear = false; const target = datanetunimKlaliXM.find(itema => itema.mh === idKupa);let t=1;
    
                rowsForIdKupa.forEach(row => {
                    const tsuaNominaliBfoal = row.getElementsByTagName("TSUA_NOMINALI_BFOAL")[0]?.textContent;
                    const tkfDivuach = row.getElementsByTagName("TKF_DIVUACH")[0]?.textContent;
                    const schumkvutzaKey = `tesua${t}`;
                    target[schumkvutzaKey]=tsuaNominaliBfoal+"="+tkfDivuach;
                    t=t+1;
                    if (tsuaNominaliBfoal && tkfDivuach) {
                        const year = tkfDivuach.substring(0, 4);
                        const month = tkfDivuach.substring(4, 6);
    
                        // אם מדובר בתחילת שנה (ינואר)
                        if (month === "01" && !startOfYear) {
                            startOfYear = true;
                            cumulativeReturn = 1 + (parseFloat(tsuaNominaliBfoal) / 100);
                        } 
                        // אם לא בתחילת שנה, מחשבים את הצבירה
                        else if (startOfYear) {
                            cumulativeReturn *= 1 + (parseFloat(tsuaNominaliBfoal) / 100);
                        }
                    }
                });
    
               
                if (startOfYear) {
                    idKupaMap[idKupa] = cumulativeReturn;
                }
               
                target.tusaAharona = Number(tsuaNominaliBfoal);
                target.tesuaMitchilatshana = ((cumulativeReturn - 1) * 100).toFixed(2);
            });
   

           
            
        })
        .catch(error => console.error('Error parsing XML:', error));
    
  }

  async function fetchNechasim() {
    try {
        const response = await fetch('gemelNechasim.xml');
        if (!response.ok) {
            throw new Error(`שגיאה בטעינת הקובץ: ${response.status}`);
        }
        const nechsimstring = await response.text();
        const parser = new DOMParser();
        const xmlNechasim = parser.parseFromString(nechsimstring, "application/xml");

        const rows = xmlNechasim.getElementsByTagName("Row");
        datanetunimKlaliXM.forEach(item => {
            const idKupa = item.mh;

            for (const row of rows) {
                const mhkupa1 = row.querySelector("ID_KUPA")?.textContent || '';
                const sugneches = row.querySelector("ID_SUG_NECHES")?.textContent || '';
                const schumsugneches = row.querySelector("SCHUM_SUG_NECHES")?.textContent || '';
                const ahuzsugneches = row.querySelector("ACHUZ_SUG_NECHES")?.textContent || '';
                const shemsugneches = row.querySelector("SHM_SUG_NECHES")?.textContent || '';

                if (mhkupa1 && Number(mhkupa1) === Number(idKupa)) {
                    const target = datanetunimKlaliXM.find(item => item.mh === idKupa);

                    if (target) {
                        const schumkvutzaKey = `kvutzaSchum${sugneches}`;
                        const ahuzkvutzaKey = `kvutzaAhuz${sugneches}`;
                        const sugkvutzaKey = `kvutzaSug${sugneches}`;

                        target[schumkvutzaKey] = schumsugneches;
                        target[ahuzkvutzaKey] = ahuzsugneches;
                        target[sugkvutzaKey] = shemsugneches;

                        if (Number(sugneches) === 4751) {
                            const shiurMenayut = Number(ahuzsugneches);
                            target.ramatsikon = calculateRiskLevel(shiurMenayut);
                        }
                    }
                }
            }
        });

        alert("הטעינה הסתיימה בהצלחה!");
    } catch (error) {
        console.error("שגיאה בתהליך הטעינה:", error);
    }
}



  function calculateRiskLevel(shiurMenayut) {
    if (shiurMenayut < 30) return 'נמוכה';
    if (shiurMenayut >= 30 && shiurMenayut < 55) return 'בינונית';
    if (shiurMenayut >= 55 && shiurMenayut < 75) return 'בינונית-גבוה';
    return 'גבוהה';
}

  
async function makejason() {
    

        // המרת הנתונים לפורמט JSON
        const json = JSON.stringify(datanetunimKlaliXM, null, 2);

        // יצירת הקובץ
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dataJasonM.json';
        link.click();

        console.log("הקובץ נוצר בהצלחה!");
    
}


    async function fetchdataJason() {
        try {
            const response = await fetch('dataJason.json'); // שליפת הקובץ
            if (!response.ok) {
                throw new Error(`שגיאה: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json(); 
            return data; 
        } catch (error) {
            console.error('שגיאה בשליפת הנתונים:', error);
        }
    }
    
        
            
         
        
      
        
       
        
 



  
