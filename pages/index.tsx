import React from 'react';
import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import exportCompaniesToPDF from './export';
import axios, { AxiosError } from 'axios';
import 'mdb-ui-kit/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardHeader, MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBInput, MDBTextArea } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive, faCancel, faCheck, faCoffee, faTrash } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

type LoginProps = {
  email: string,
  password: string
};

type LoginFormProps = {
  onLogin: (company: Company) => void,
  onContinueRegistry: (email: string, password: string) => void
};

type Company = {
  email: string,
  password: string,
  nombre: string,
  nit: number,
  direccion: string,
  telefono: string
};


type RegistroProps = {
  login: LoginProps,
  onCompanySubmitted: (company: Company) => void,
  onCancel: () => void
}

async function verifyLogin(props: LoginProps) {
  const { email, password } = props;
  const resp = await axios.post("api/verify", { email, password });
  return resp.data;
}

async function postCompany(company: Company) {
  const resp = await axios.post('api/company', company);
  return resp.status == 200;
}

async function fetchCompanies() {
  const resp = await axios.get("/api/companies");
  return resp.data;
}

async function deleteCompany(company: Company) {
  const resp = await axios.post("/api/delete", company);
  return resp.data;
}


const LoginForm = (props: LoginFormProps) => {
  const { onLogin, onContinueRegistry } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fallidoVisible, setFallidoVisible] = useState(false);

  return <form onSubmit={async (event) => {
    event.preventDefault();
    const company = await verifyLogin({ email, password });
    if (company)
      onLogin(company);
    else {
      setFallidoVisible(true);
      setTimeout(() => { setFallidoVisible(false) }, 4000);
    }
  }}>

    <div className="input-group mb-3">
      <input
        type="email"
        className="form-control"
        placeholder="Digita tu correo electrónico aquí"
        aria-label="Tu correo electrónico"
        aria-describedby="email"
        value={email} required onChange={(event) => setEmail(event.target.value)}
      />
    </div>
    <div className="input-group mb-4">
      <input type="password" placeholder="Digita tu contraseña aquí" className="form-control" required onChange={(event) => setPassword(event.target.value)} />
    </div>
    <div className="row">
      <div className="col"><button type="submit" className="btn btn-primary btn-block" >Ingresar</button></div>
      <div className="col"><button type="button" className='btn btn-secondary btn-block' onClick={() => onContinueRegistry(email, password)}>Registrarme</button></div>
    </div>
    {fallidoVisible && <div className="alert alert-danger" role="alert">
      Ingreso fallido: no encontramos una combinación de correo y contraseña correspondientes a las que ingresaste.
    </div>}
  </form>
}
function isAxiosError(candidate: unknown): candidate is AxiosError {
  if (candidate && typeof candidate === 'object' && 'isAxiosError' in candidate) {
    return true;
  }
  return false;
}

function RegistroEmpresarial(props: RegistroProps) {
  const { login, onCompanySubmitted, onCancel } = props
  const { email: pEmail, password: pPassword } = login;
  const [email, setEmail] = useState(pEmail);
  const [password, setPassword] = useState(pPassword);
  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [showDuplicateNITError, setShowDuplicateNITError] = useState(false);

  return <form onSubmit={async (e) => {
    try {
      e.preventDefault();
      const company = { email, password, nombre, nit: parseInt(nit), direccion, telefono }
      const result = await postCompany(company);
      if (result)
        onCompanySubmitted(company);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const err = error as AxiosError;
        const data = err.response?.data as { error: string };
        if (data.error === 'Duplicated NIT') {
          setShowDuplicateNITError(true);
          setTimeout(() => setShowDuplicateNITError(false), 4000);
        }
      } else
        console.error({ error });
    }
  }

  }>
    <p className="card-text">En realidad solamente te enviaré un correo de confirmación, y no más.</p>
    <div className="input-group mb-4">
      <input
        type="email"
        className="form-control"
        placeholder="Digita tu correo electrónico aquí"
        aria-label="Tu correo electrónico"
        aria-describedby="email"
        value={email} required onChange={(event) => setEmail(event.target.value)}
      />
    </div>
    <div className="input-group mb-4">
      <input type="password" placeholder="Digita tu contraseña aquí" className="form-control" required onChange={(event) => setPassword(event.target.value)} />
    </div>
    <div className="input-group mb-4">
      <input type='text' name='nombre' placeholder='Nombre de tu empresa'
        className="form-control" required value={nombre} onChange={(e) => setNombre(e.target.value)}></input>
    </div>
    <div className="input-group mb-4">
      <input type='number' name='nit' placeholder='NIT o Número de Identificación Tributaria' className="form-control" value={nit} required onChange={(e) => setNit(e.target.value)}></input>
    </div>
    <div className="input-group mb-4">
      <MDBTextArea />
      <textarea id="direccion" name="direccion" rows={4} placeholder='Dirección de la empresa' className="form-control" required value={direccion} onChange={(e) => setDireccion(e.target.value)}></textarea>
    </div>
    <div className="input-group mb-4">
      <input type='number' name='telefono' placeholder='Teléfono de la empresa' className="form-control" value={telefono} required onChange={(e) => setTelefono(e.target.value)}></input>
    </div>
    <div className='row'>
      <div className='col'>
        <button type="submit" className="btn btn-primary btn-block">Terminar registro</button>
      </div>
      <div className='col'>
        <button type="button" className="btn btn-secondary btn-block" onClick={onCancel}>Ya no quiero, cancelar</button>
      </div>
    </div>


    {showDuplicateNITError && <div className="alert alert-danger" role="alert">
      NIT duplicado: hemos encontrado por lo menos un registro de empresa con el NIT {nit}.
    </div>}
  </form>
}

export async function getServerSideProps(context: any) {
  try {
    await clientPromise;
    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

function ExportPDFButton() {
  return <a href="#" data-mdb-toggle="tooltip" title="Exportar a PDF" onClick={exportCompaniesToPDF}><i className="fa-solid fa-file-pdf" ></i></a>;
}

function Navbar() {
  return <>
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <a className="navbar-brand mt-2 mt-lg-0" href="/" >
              <img src="Logo_Lite_Thinking_Sin_Fondo_1.png" alt="Lite Thinking" width="60" />
            </a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="Felipe Cardozo - English CV 2023.pdf">Hoja de vida</a>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <a className="text-reset me-3" href="#">
              <i className="fas fa-shopping-cart"></i>
            </a>

            <div className="dropdown">
              <a className="text-reset me-3 dropdown-toggle hidden-arrow" href="#" id="navbarDropdownMenuLink" role="button"
                data-mdb-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-bell"></i>
                <span className="badge rounded-pill badge-notification bg-danger">1</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                <li>
                  <a className="dropdown-item" href="#">Some news</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Another news</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Something else here</a>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <a className="dropdown-toggle d-flex align-items-center hidden-arrow" href="#" id="navbarDropdownMenuAvatar"
                role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                <img src="mini-retrato.webp" className="rounded-circle" height="25"
                  alt="Retrato del desarrollador" />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
                <li>
                  <a className="dropdown-item" href="#">Mi hoja de vida</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Settings</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </>
}

type Companies = {
  list: Company[],
  onCompanyDeleted: (company: Company) => void
  onCompanyEdited: (company: Company) => void
};

type EditorProps = {
  field: string,
  currentValue: any,
  type: string,
  onFieldUpdated: (field: string, newValue: any) => void
}

async function updateField(field: string, newValue: any, key: number) {
  const resp = await axios.post("api/update", { field, newValue, key });
  return resp.data;
}

const OnClickEditor = (props: EditorProps) => {
  const { field, currentValue, type, onFieldUpdated } = props;
  const [editorVisible, setEditorVisible] = useState(false);
  const [value, setValue] = useState(currentValue);
  return <>
    {!editorVisible && <div onClick={() => { setEditorVisible(true) }}>{currentValue}</div>}
    {editorVisible &&
      <>
        <input type={type} value={value} onChange={(e) => setValue(e.target.value)} />
        <MDBBtn onClick={async () => {
          setEditorVisible(false);
          onFieldUpdated(field, value);
        }}>
          <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
        </MDBBtn>
        <MDBBtn color='secondary' onClick={() => {
          setValue(currentValue);
          setEditorVisible(false);
        }}>
          <FontAwesomeIcon icon={faCancel}></FontAwesomeIcon>
        </MDBBtn>
      </>}
  </>
};


type CellEditorProps = {
  field: 'nombre' | 'direccion' | 'telefono' | 'email',
  record: Company,
  onCellUpdated: (newValue: any) => void,
}

function CellEditor(props: CellEditorProps) {
  const { field, record, onCellUpdated } = props;

  return <td><OnClickEditor field={field} currentValue={record[field]} type={typeof (field)}
    onFieldUpdated={async (field, newValue) => {
      await updateField(field, newValue, record.nit)
      onCellUpdated(newValue)
    }}
  ></OnClickEditor></td>
}


function ListadoEmpresas(props: Companies) {
  const { list, onCompanyDeleted, onCompanyEdited } = props;
  const [successMessage, setSuccessMessage] = useState('');

  const cellUpdated = (company: Company) => {
    onCompanyEdited(company);
    setSuccessMessage(`Se actualizó exitosamente el campo de la campañía ${company.nombre}.`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };
  return <MDBCard style={{ width: "1000px" }} >
          <MDBCardHeader>
            <MDBCardTitle>Puedes actualizar cualquier campo al hacer 'click' en su respectiva celda.</MDBCardTitle>
          </MDBCardHeader>
        <MDBCardBody>
          <MDBTable id="listado_empresas">
            <MDBTableHead>
            
              <tr>
              <th>N.I.T.</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th><ExportPDFButton /></th>
              </tr>  
            </MDBTableHead>
            <MDBTableBody>
              {list.map((company) => (<tr key={company.nit}>
                <td>{company.nit}</td>
                <CellEditor field='nombre' record={company} onCellUpdated={() => cellUpdated(company)} />
                <CellEditor field='email' record={company} onCellUpdated={() => cellUpdated(company)} />
                <CellEditor field='direccion' record={company} onCellUpdated={() => cellUpdated(company)} />
                <CellEditor field='telefono' record={company} onCellUpdated={() => cellUpdated(company)} />
                <td><a href="#" data-mdb-toggle="tooltip" title="Elimina la compañía" onClick={async () => {
                  await deleteCompany(company);
                  onCompanyDeleted(company);
                  setSuccessMessage(`Se eliminó la empresa ${company.nombre}`);
                  setTimeout(() => setSuccessMessage(''), 4000);
                }}> <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></a></td>
              </tr>))}
            </MDBTableBody>
          </MDBTable>
        {successMessage && <div className="alert alert-success" role="alert">
          {successMessage}
        </div>}
      

    </MDBCardBody>
  </MDBCard>
}


const MainSection = (isConnected: boolean) => <main>
  {false && <ExportPDFButton></ExportPDFButton>}
  {isConnected ? (
    <div className="subtitle">You are connected to MongoDB</div>
  ) : (
    <div className="subtitle">
      You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
      for instructions.
    </div>
  )}

</main>;


export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [splitPanelVisible, setSplitPanelVisible] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companies, setCompanies] = useState([]);
  const [myCompany, setMyCompany] = useState({ nombre: '' });

  const reloadCompanies = () => fetchCompanies().then(setCompanies);

  useEffect(() => {
    reloadCompanies();
  }, [myCompany]);

  return (
    <div>
      <Head>
        <title>Registro empresarial</title>
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      {!splitPanelVisible && <Navbar></Navbar>}
      <section>
        {splitPanelVisible && <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 vh-100">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Bienvenido a este sitio de prueba</h5>
                  <p className="card-text">Por favor regístrate para tener ingreso</p>
                  <LoginForm onContinueRegistry={(email, password) => {
                    setShowRegisterForm(true);
                    setSplitPanelVisible(false);
                    setEmail(email);
                    setPassword(password);
                  }} onLogin={(company) => {
                    setSplitPanelVisible(false);
                    setShowRegisterForm(false);
                    setMyCompany(company);
                  }}></LoginForm>
                </div>
              </div>

            </div>
            <div className="col-lg-6 vh-100">
              <img src='esplanade-louvre.webp' className="w-100" ></img>
            </div>
          </div>
        </div>
        }
        {!splitPanelVisible &&
            <MDBContainer>
            {showRegisterForm && <MDBRow>
              <MDBCard className='text-center'>
                <MDBCardHeader>
                <MDBCardTitle>
                  Subscríbete a mi sitio de noticias
                  </MDBCardTitle>
                </MDBCardHeader>
                <MDBCardBody>
                  <RegistroEmpresarial login={{ email, password }} onCompanySubmitted={(company) => {
                    setSplitPanelVisible(false);
                    setShowRegisterForm(false);
                    setMyCompany(company);
                  }} onCancel={() => {
                    setSplitPanelVisible(true);
                    setShowRegisterForm(true);
                  }}></RegistroEmpresarial>
                  </MDBCardBody>
              </MDBCard>
            </MDBRow>
            }
            {!showRegisterForm &&
              <MDBRow>
                <main>
                  <div className="col-lg-6 vh-100">
                    <h5 >Bienvenido {myCompany.nombre}!</h5>
                    <ListadoEmpresas
                      list={companies}
                      onCompanyDeleted={reloadCompanies}
                      onCompanyEdited={reloadCompanies} />
                  </div>
                </main>
              </MDBRow>
            }
            </MDBContainer>
        }
      </section>
    </d