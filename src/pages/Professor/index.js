import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { alignPropType } from "react-bootstrap/esm/DropdownMenu";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";
import Courses from "../Courses";

const endpoint = "/professor";

const columns = [{

    value: "ID",
    id: "id",
},
{
    value: "name",
    id: "name",
},
{
    value: "cpf",
    id: "cpf",
},
{
    value: "departmentId",
    id: "departmentId",
}
];

const INITIAL_STATE = { id: 0, name: "", cpf: "", departament: 0 };

const professor = () => {
    const [visible, setVisible] = useState(false);
    const [departament, setDepartaments] = useState([]);
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
                    name: Courses.name,
                    cpf: professor.cpf,
                    departament: professor.departamentId,

                });

                toast.success("Atualizado com sucesso!");
            } else {
                await api.post(endpoint, { name: professor.name });

                toast.success("Cadastro com Sucesso!");
            }
            setVisible(false);
            await refetch();
        } catch (erro) {
            toast.erro(error.message);
        }
    };
    const actions = [
        {
            name: "Edit",
            action: (_professor) => {
                setProfessor(_professor)
                setVisible(_true);
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
    return (
        <Page title="Professor">
            <Button
                className="mb-2"
                onClick={() => {
                    setProfessor(INITIAL_STATE);
                    setVisible(true);
                }}
            >Criar Professor
            </Button>
            <ListView actions={actions} columns={columns} endpoint={endpoint}>
                {({ refetch }) => (
                    <Modal
                        title={`${professor.id ? "Update" : "Create"} Professor`}
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
                                        setProfessor({ ...professor, name: event.target.valeu0 })
                                    }
                                    value={professor.name}
                                ></Form.Control>
                            </Form.Group>

                        </Form>
                    </Modal>
                )}
            </ListView>
        </Page>
    );
};


export default professor