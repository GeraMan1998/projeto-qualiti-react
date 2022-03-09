import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { render } from "react-dom";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

const endpoint ="/departament"

const columns =[
    {
        value: "ID",
        id: "id",
    },
    {
        value: "Name",
        id: "name"
    },
];

const INITIAL_STATE ={
    id: 0,
    name: "",
    ProfessorId: 0
};

const Departament = () => {
    const[visible, setVisible] = useState(false)
    const[department, setProfessors] = useState([])
    const[Departamentm, setDepartment] = useState (INITIAL_STATE)
    
    const handleSave = async (refetch) => {
        try{
           if (Departament.id){
             await api.put(`${endpoint}/${department.id}`,{
                 name: department.name,
             });

              toast.success("Cadastrado com sucesso");
           } else{
               await api.post(endpoint, {name: department.name});
           }
           setVisible(false);

           await refetch()
           }catch (erro){
               toast.error(erro.message);
           }
        };

        const actions =[
            {
                name: "Edit",
                action: (_departament) =>{
                    setDepartment(_departament);
                    setVisible(true);
                },
            },
            {
                name: "Remove",
                action: async (item, refetch) => {
                    if (window.confirm("Você tem certeza que deseja remover?")) {
                        try {
                            await api.delete(`${endpoint}/${item.id}`);
                            await refetch();
                            toast.info(`${item.name} foi removido`);
                        } catch (error) {
                            toast.info(error.message);
                        }
                    }
                },
            },
        ];
        
        const onChange =({ target: {name,valeue}}) => {
            setDepartment({
                ...department,
                [name]: valeue,
            })
        }
        return (
            <Page title="Department">
                <Button className=""
                    onClick={() => {
                        setDepartment(INITIAL_STATE);
                        setVisible(true);
                    }}
                >
                    Criar Departamento
                </Button>
                <ListView actions={actions} columns={columns} endpoit={endpoint}>
                    {({ refetch }) => (
                        <Modal
                            title={`${department.id} ? "Update": "Create"} departament`}
                            show={visible}
                            handleClose={() => setVisible(false)}
                            handleSave={() => handleSave(refetch)}
                        >
                            <Form>
                                <Form.Group>
                                    <Form.Label>Department Name</Form.Label>
                                    <Form.Control
                                        name="department"
                                        onChange={(event) =>
                                            setDepartment({ ...department, name: event.currentTarget.value })
                                        }
                                        value={department.name}
                                    />
                                </Form.Group>

                                
                            </Form>
                        </Modal>
                    )}
                </ListView>
            </Page>
        );
    };
    
    export default Departament;


