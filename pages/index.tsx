import React, { FC } from 'react';
import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import exportCompaniesToPDF from './export';
import axios from 'axios';
import 'mdb-ui-kit/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from 'react';

async function subscribe(email:string) {
  await axios.post("/api/subscribe", { email, text: "Hola Felipe desde local" });
}
type LoginProps = {
  email: string,
  password: string
};

type LoginFormProps = {
  onLogin: (company:Company) => void,
  onContinueRegistry: (email:string, password: string) => void
}


async function verifyLogin(props:LoginProps) {
  const {email, password} = props;
  const resp = await axios.post("api/verify", {email, password});
  return resp.data;
}

type Company = {
  email: string,
  password: string,
  nombre: string, 
  nit: number,
  direccion: string,
  telefono: string
};


async function postCompany(company:Company){
  const resp = await axios.post('api/company', company);
  return resp.status == 200;
}

const LoginForm = (props:LoginFormProps) => {
  const {onLogin, onContinueRegistry} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fallidoVisible, setFallidoVisible] = useState(false);

  return <form onSubmit={async (event) => {
    event.preventDefault();
    const company = await verifyLogin({email, password});
    if (company) 
      onLogin(company);
    else {
      setFallidoVisible(true);
      setTimeout(() => {setFallidoVisible(false)}, 4000);
    }
  }}>
    <div className="form-outline mb-4">
      <input type="email" id="form1Example1" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)}/>
      <label className="form-label" htmlFor="form1Example1">Email address</label>
    </div>
    <div className="form-outline mb-4">
      <input type="password" id="form1Example2" className="form-control" onChange={(event) => setPassword(event.target.value)} />
      <label className="form-label" htmlFor="form1Example2">Password</label>
    </div>
    <button type="submit" className="btn btn-primary btn-block" >Ingresar</button>
    <button type="button" className='btn btn-secondary btn-block' onClick={() => onContinueRegistry(email, password)}>Registrarme</button>
    {fallidoVisible && <div className="alert alert-danger" role="alert">
          Ingreso fallido: no encontramos una combinación de correo y contraseña correspondientes a las que ingresaste.
        </div>}
  </form>
}



type RegistroProps = {
  login:LoginProps,
  onCompanySubmitted: (company:Company) => void
}

function RegistroEmpresarial(props:RegistroProps) {
  const {login, onCompanySubmitted} = props
  const {email, password} = login;
  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  return <form onSubmit={async (e) =>  {
    e.preventDefault();
    const company = {email, password, nombre, nit:parseInt(nit), direccion, telefono}
    const result = await postCompany(company);
    if (result)
      onCompanySubmitted(company);
  }

  }>
        <h1 className="title">
      Subscríbete a mi newsletter
    </h1>   
    <div className="form-outline mb-4">
      <div >Correo electrónico: </div>
      <div>{email}</div>
      <div>Password: {password}</div>
    
    </div>
 
    <div className="form-outline mb-4">
      <label htmlFor='empresa' className="form-label" >¿Cómo se llama tu empresa?</label>
      <input type='text' name='nombre' placeholder='Mi empresa' className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)}></input>

    </div>
    <div className="form-outline mb-4">
      <label htmlFor='nit' className="form-label" >NIT o Número de Identificación Tributaria</label>
      <input type='text' name='nit' placeholder='12345' className="form-control" value={nit} onChange={(e) => setNit(e.target.value)}></input>

    </div>
    <div className="form-outline mb-4">
      <label htmlFor='direccion' className="form-label">Dirección</label>
      <input type='text' name="direccion" placeholder='Calle 123, Bogota' className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)}></input>
    </div>
    <div className="form-outline mb-4">
      <label htmlFor='telefono' className="form-label" >Teléfono</label>
      <input type='text' name='telefono' placeholder='+57 313 413 6320' className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)}></input>
    </div>
    <button type="submit" className="btn btn-primary btn-block">Terminar registro</button>
    <button className="btn btn-secondary btn-block">Cancelar</button>
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
  return  <div >Export PDF button:
    <button onClick={exportCompaniesToPDF}><i className="fa-solid fa-file-pdf" ></i></button>
  </div>;
}

function Navbar() {
  return <>
  <header className="mb-10">
  
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <i className="fas fa-bars"></i>
        </button>
  
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <a className="navbar-brand mt-2 mt-lg-0" href="#" style={{backgroundColor:"black"}}>
            <img src="Logo_Lite_Thinking_Sin_Fondo_1.png" alt="Lite Thinking" width="60"/>
          </a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="Felipe Cardozo - English CV 2023.pdf">Descarga mi hoja de vida</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Listado de empresas</a>
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
                alt="Retrato del desarrollador"  />
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
  list: Company[]
};

function ListadoEmpresas(props:Companies) {
  const {list} = props;
  return <>
  <ExportPDFButton />
  <table className='table' id="listado_empresas">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>N.I.T.</th>
        <th>Dirección</th>
        <th>Teléfono</th>
      </tr>
    </thead>
      <tbody>
    {list.map(({nombre, email, nit, direccion, telefono}) => (<tr key={nit}>
      <td>{nombre}</td>
      <td>{email}</td>
      <td>{nit}</td>
      <td>{direccion}</td>
      <td>{telefono}</td>
      <td><button >Eliminar</button></td>
      </tr>))}
      </tbody>
  </table></>
}

async function fetchCompanies() {
  const resp = await axios.get("/api/companies");
  return resp.data;
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [splitPanelVisible, setSplitPanelVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companies, setCompanies] = useState([]);
  const [myCompany, setMyCompany] = useState({nombre:''});

  useEffect( () => {
    if (companies.length === 0)
    fetchCompanies()
    .then((companies) => setCompanies(companies));
  }); 


  return (
    <div>
      <Head>
        <title>Registro empresarial</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar></Navbar>
      
      <section>
        <div className="container-fluid">
          {splitPanelVisible &&  <div className="row">
            <div className="col-lg-6 vh-100">
              <LoginForm onContinueRegistry={(email, password) => { 
                setFormVisible(true);
                setEmail(email);
                setPassword(password);
                }} onLogin={(company) => {
                  setSplitPanelVisible(false);
                  setMyCompany(company);
                }}></LoginForm>
            </div>
            {!formVisible &&
            <div className="col-lg-6 vh-100">
              <img src='esplanade-louvre.webp' style={{width:"100%"}}></img>
            </div>
            }
            {formVisible &&
            <div className="col-lg-6 vh-100">
                <RegistroEmpresarial login={{email, password}} onCompanySubmitted={(company) => {
                  setSplitPanelVisible(false); 
                  setMyCompany(company)}} ></RegistroEmpresarial>
            </div>}
            <main>              
              {false && <ExportPDFButton></ExportPDFButton>}
              {isConnected ? (
                <div className="subtitle">You are connected to MongoDB</div>
              ) : (
                <div className="subtitle">
                  You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
                  for instructions.
                </div>
              )}

            </main>
          </div>
              }
              {!splitPanelVisible && 
              <div className="row">
                <main>
                <div className="col-lg-6 vh-100">
                  <h2>Bienvenido {myCompany.nombre}!</h2>
                  <ListadoEmpresas list={companies} />
                  </div>
                </main>
              </div>}
        </div>
      </section>
    </div>
  )
}
