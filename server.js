import fetch from 'node-fetch';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

const fetchData = async (req, res) => {
    try {
        const response = await fetch('https://api.covid19india.org/raw_data.json').then(res => res.json());
        
        let data = response['raw_data'];

        let filteredData = data.filter((sample) => {
            return  sample.currentstatus.toLowerCase() !== 'hospitalized'  ;
        });
        
        res.json({
            data: {
                length: filteredData.length,
                list: filteredData,
            },
        });

         
    } catch (error) {
        res.status(500).json(`An error occured: ${error.message}`);
    }
}

app.get('/data', (req, res) => {
    fetchData(req, res);
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});