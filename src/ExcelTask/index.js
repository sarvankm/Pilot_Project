import * as React from 'react';
import * as xlsx from 'xlsx';
import { ReactTabulator, reactFormatter, ReactTabulatorOptions, ColumnDefinition } from 'react-tabulator';
import "react-tabulator/lib/styles.css"; // default theme
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)
import { Button, Form, Input, Modal, Select } from "antd";
import {
    Chart as ChartJS, ArcElement, CategoryScale,
    LinearScale,
    BarElement,
    Title, Tooltip, Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale,
    LinearScale,
    BarElement,
    Title, Tooltip, Legend);

export default function ExcelTask() {
    const [state, setState] = React.useState({
        data: [],
        selectedName: ''
    });
    const [data, setdata] = React.useState([]);
    const [mapData, setMapData] = React.useState();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState();
    const [selectValue, setSelectValue] = React.useState();
    const [showChart1, setShowChart1] = React.useState(false);
    const [showChart2, setShowChart2] = React.useState(false);
    const [firstChartData, setFirstChartData] = React.useState({
        labels: ['Red', 'Blue', 'Green'],
        datasets: [
            {
                label: '# of Votes',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    });
    const [secondChartData, setSecondChartData] = React.useState({
        labels: ['Status 0', 'Status 1', 'Status 2'],
        datasets: [
            {
                label: 'Len',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    });


    const editableColumns = [
        { title: 'id', field: 'id', width: 150, headerFilter: 'input' },
        { title: 'len', field: 'len', width: 150, headerFilter: 'input' },
        { title: 'wkt', field: 'wkt', width: 150, headerFilter: 'input' },
        { title: 'status', field: 'status', width: 150, headerFilter: 'input' }
    ];



    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        const handleMapData = mapData;
        const handleData = data;
        handleMapData.set(data[0].id + 1, { id: data[0].id + 1, len: inputValue, status: selectValue, wkt: '' })
        handleData.unshift({ id: data[0].id + 1, len: inputValue, status: selectValue, wkt: '' })
        console.log(handleMapData);
        console.log(handleData);
        setdata([...handleData])
        setMapData(handleMapData);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    let ref = React.useRef();

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);

                const map = new Map();
                json.forEach(item => {
                    map.set(item.id, item);
                });
                setMapData(map)
                setdata(json.reverse())
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }
    function firstChartSplice(data) {
        let status0 = 0;
        let status1 = 0;
        let status2 = 0;
        console.log(data);
        data.forEach((item) => {
            if (item.status === 0) {
                status0 += 1;
            }
            else if (item.status === 1) {
                status1 += 1;
            }
            else if (item.status === 2) {
                status2 += 1;
            }
        })
        setFirstChartData({
            labels: ['Status 0', 'Status 1', 'Status 2'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [status0, status1, status2],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        })
        setShowChart1(true);
    }
    function secondChartSplice() {
        let status0Len = 0;
        let status1Len = 0;
        let status2Len = 0;
        data.forEach((item) => {
            if (item.status === 0) {
                status0Len += item.len;
            }
            else if (item.status === 1) {
                status1Len += item.len;
            }
            else if (item.status === 2) {
                status2Len += item.len;
            }
        })
        console.log(status1Len);
        setSecondChartData({
            labels: ['Status 0', 'Status 1', 'Status 2'],
            datasets: [
                {
                    label: 'Len',
                    data: [status0Len, status1Len, status2Len],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ],
        })
        setShowChart2(true);
    }
    return (
        <div>

            {showChart1 && data.length > 0 ? <div style={{ position: 'absolute', top: '10%', right: '5%' }}>
                <Pie data={firstChartData} />
            </div> : <></>}
            {showChart2 && data.length > 0 ? <div style={{ position: 'absolute', top: '55%', right: '5%', height: '30vh' }}>
                <Bar options={{
                    'resposive': true, plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                }} data={secondChartData} />
            </div> : <></>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Form>
                    <label htmlFor="upload">Upload File</label>
                    <Input
                        type="file"
                        accept='.xlsx'
                        name="upload"
                        id="upload"
                        onChange={readUploadFile}
                    />
                </Form>
                <Button type="primary" onClick={showModal}>
                    Add New Data
                </Button>
            </div>
            <Modal title="Baslik" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form.Item label={'Len bilgisi giriniz'}>
                    <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Len bilgisi giriniz" />
                </Form.Item>
                <Form.Item label={'Status seciniz'}>
                    <Select
                        value={selectValue}
                        onChange={(e) => setSelectValue(e)}
                        options={[
                            { value: '0', label: '0' },
                            { value: '1', label: '1' },
                        ]}
                    />
                </Form.Item>
            </Modal>
            <div style={{ height: '50vh', overflowY: 'scroll' }}>
                <ReactTabulator
                    columns={editableColumns}
                    data={data}
                    options={{ 'selectable': 1, onclick: () => { console.log('ok') } }}
                />
            </div>
            <div style={{ marginTop: '30px' }}><Button onClick={() => { firstChartSplice(data) }}>Analiz 1</Button><Button onClick={() => secondChartSplice()} style={{ marginLeft: '5px' }}>Analiz 2</Button></div>

        </div>
    );
};