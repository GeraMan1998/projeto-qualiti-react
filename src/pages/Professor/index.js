import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { render } from "react-dom";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

const endpoint = "/professor";

const columns = [
    {
        value: "ID",
        id: "id",
    },
    {
        value: "Name",
        id: "name"
    },
    {
        value: "cpf",
        id: "cpf"
    },
    {
        Value: "Department",
        id: "department",
        render: (department) => department.name,
    },
];

const INITIAL_STATE = {
    id: 0,
    name: "",
    cpf: "",
    departmentId: 0
};

const Professor = () => {
    const [visible, setVisible] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [professor, setProfessor] = useState(INITIAL_STATE);

    useEffect(() => {
        api
            .get("/departments")
            .then((response) => {
                setDepartments(response.data);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    const handleSave = async (refetch) => {
        try {
            if (professor.id) {
                await api.put(`${endpoint}/${professor.id}`, {
                    name: professor.name,
                    cpf: professor.cpf,
                    departmentId: professor.departmentId,
                });

                toast.success("Atualizado com sucesso!");
            } else {
                await api.post(endpoint, { name: professor.name });

                toast.success("Cadastrado com sucesso");
            }

            setVisible(false);

            await refetch();
        } catch (erro) {
            toast.error(erro.message);
        }
    };

    const actions = [
        {
            name: "Edit",
            action: (_professor) => {
                setProfessor(_professor);
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
        setProfessor({
            ...professor,
            [name]: valeue,
        })
    }
    return (
        <Page title="Professor">
            <Button className=""
                onClick={() => {
                    setProfessor(INITIAL_STATE);
                    setVisible(true);
                }}
            >
                Criar Professor
            </Button>
            <ListView actions={actions} columns={columns} endpoit={endpoint}>
                {({ refetch }) => (
                    <Modal
                        title={`${professor.id} ? "Update": "Create"} Professor`}
                        show={visible}
                        handleClose={() => setVisible(false)}
                        handleSave={() => handleSave(refetch)}
                    >
                        <Form>
                            <Form.Group>
                                <Form.Label>Professor Name</Form.Label>
                                <Form.Control
                                    name="professor"
                                    onChange={(event) =>
                                        setProfessor({ ...professor, name: event.currentTarget.value })
                                    }
                                    value={professor.name}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>cpf</Form.Label>
                                <Form.Control
                                    name="cpf"
                                    onChange={onChange}
                                    value={professor.cpf}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Departament Name</Form.Label>
                                <Form.Control
                                    name="departament"
                                    onChange={onChange}
                                       
                                    
                                    value={professor.departmentId}
                                />
                            </Form.Group>
                        </Form>
                    </Modal>
                )}
            </ListView>
        </Page>
    );
};

export default Professor;