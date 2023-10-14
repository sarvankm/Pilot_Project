import * as React from 'react';
import * as xlsx from 'xlsx';
// for styles:
// import 'react-tabulator/lib/styles.css'; // default theme
// import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'; // use Theme(s)
import { ReactTabulator, reactFormatter, ReactTabulatorOptions, ColumnDefinition } from 'react-tabulator';

import "react-tabulator/lib/styles.css"; // default theme
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)
import DateEditor from "react-tabulator/lib/editors/DateEditor";
import MultiValueFormatter from "react-tabulator/lib/formatters/MultiValueFormatter";
import MultiSelectEditor from "react-tabulator/lib/editors/MultiSelectEditor";
import { createRoot } from 'react-dom/client';
import { Button, Form, Input, Modal, Select } from "antd";


export default function ExcelTask() {
    const [state, setState] = React.useState({
        data: [],
        selectedName: ''
    });
    const [data, setdata] = React.useState();
    const [mapData, setMapData] = React.useState();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState();
    const [selectValue, setSelectValue] = React.useState();
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
        handleMapData.set(data[0].id + 1, { id: data[0].id + 1, len: inputValue, status: selectValue })
        handleData.unshift({ id: data[0].id + 1, len: inputValue, status: selectValue })
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

    const rowClick = (e, row) => {
        console.log('ref table: ', ref.current); // this is the Tabulator table instance
        // ref?.current && ref?.current.replaceData([])
        console.log('rowClick id: ${row.getData().id}', row, e);
        setState({ selectedName: row.getData().name });
    };

    const clearData = () => {
        setState({ data: [] });
    };
    const modifyData = () => {
        const _newData = data.filter((item) => item.name === 'Oli Bob');
        setState({ data: _newData });
    };
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

    return (
        <div style={{ height: '100vh', overflow: 'scroll' }}>
            <div style={{ display: 'flex' }}>
                <form>
                    <label htmlFor="upload">Upload File</label>
                    <input
                        type="file"
                        accept='.xlsx'
                        name="upload"
                        id="upload"
                        onChange={readUploadFile}
                    />
                </form>
                <Button type="primary" onClick={showModal}>
                    Open Modal
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
            <ReactTabulator
                columns={editableColumns}
                data={data}
                footerElement={<span>Footer</span>}
                options={{ 'selectable': 1 }}
            />
        </div>
    );
};