import React from "react";
import { Radio } from "antd";
import axios from "axios";
import AutoComplet from "./Autocomplet";
import { NavLink } from "react-router-dom";

let timer = 0;

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null, //mon fichier est stoker ici//
      dataFromBack: [],
      selectedCheckbox: [],
      value: 1,
      message: [],
      loading: false,
      backArrayFileName: [],
      listeDossier: [],
      listeNomDossier: [],
      indice: null
    };
  }

  loadingFileUpload = e => {
    this.setState({
      selectedFile: e.target.files
    });

    let fileName = [];
    console.log("e.target.files", e.target.files);
    for (let i in e.target.files) {
      if (Object.values(e.target.files)[i]) {
        fileName.push(
          Object.values(e.target.files)[i].name,
          Object.values(e.target.files)[i].webkitRelativePath
        );
      }
    }
    // console.log("FILENAME", fileName);
    this.setState({
      backArrayFileName: fileName
    });
    // console.log(this.state.listeDossier, "STATEEEE");
  };

  OnClickUpload = async () => {
    if (this.state.selectedFile !== null) {
      let listeDossier = this.state.listeDossier.length
        ? this.state.listeDossier
        : [];
      let listeNomDossier = this.state.listeNomDossier.length
        ? this.state.listeNomDossier
        : [];

      const data = new FormData();
      if (listeDossier.length === 0) {
        // console.log(this.state.selectedFile, "selected files");
        for (var i = 1; i < this.state.selectedFile.length; i++) {
          let path = this.state.selectedFile[i].webkitRelativePath.split("/");
          if (listeDossier[path[1]] !== undefined) {
            listeDossier[path[1]].push(this.state.selectedFile[i]);
          } else {
            listeDossier[path[1]] = [this.state.selectedFile[i]];
            listeDossier.push(listeDossier[path[1]]);
            listeNomDossier.push(path[1]);
          }
        }
        this.setState({
          loading: true,
          message: [],
          listeDossier: listeDossier,
          listeNomDossier: listeNomDossier
        });
      } else {
        this.setState({
          loading: false
        });
      }

      if (listeDossier.length !== 0) {
        // console.log(listeDossier, "TESTTTT");
        let arrayData = [];
        for (let i = 0; i < listeDossier.length; i++) {
          arrayData = arrayData.concat(listeDossier[i]);
        }

        arrayData.forEach(function(file) {
          if (file)
            data.append(
              "file",
              file,
              file.webkitRelativePath.replace(/[/]/g, " ** ")
            );
        });
      }
      // console.log(arrayData, "TEST");
      //} else {
      //   console.log(listeDossier, "LISTE DOSSIER VIDE");
      //   for (
      //     let i = 0;
      //     i < listeDossier[listeNomDossier[this.state.indice]].length;
      //     i++
      //   )
      //     data.append(
      //       "file",
      //       listeDossier[listeNomDossier[this.state.indice]][i]
      //     );
      // }

      let tempDebut = Date.now();
      await axios.post("http://localhost:3001/upload", data, {}).then(res => {
        let newDataBack = res.data;
        // console.log(newDataBack, "data BACK iCIII");

        let newResult = [];
        for (let i = 0; i < newDataBack.length; i++) {
          newResult.push(newDataBack[i][0].resulJson[1]);
        }

        timer = Date.now() - tempDebut;
        this.setState({
          loading: false,
          dataFromBack: newResult,
          selectedCheckbox: newResult
        });
      });
    } else {
      let returnRsult = [];
      returnRsult.push(404);
      returnRsult.push("Upload un document");
      this.setState({
        message: returnRsult
      });
    }
  };

  handleChange = e => {
    if (e.target.value) {
      const testTab = [];
      testTab.push(this.state.dataFromBack[e.target.value - 1]);
      document.getElementById("formGroupExampleInput").value =
        testTab[0]["diag"];
      this.setState({
        selectedCheckbox: testTab,
        value: e.target.value
      });
    }
  };

  sendFileBack = async () => {
    document.getElementById("inputFile").value = null;
    if (document.getElementById("formGroupExampleInput") !== null) {
      let ArrayBack = this.state.backArrayFileName;
      let selectedData = [];

      if (document.getElementById("formGroupExampleInput").value === "") {
        selectedData = [
          {
            diag: this.state.selectedCheckbox[0]["diag"],
            scores: this.state.selectedCheckbox[0]["scores"],
            checkModif: false
          }
        ];
      } else {
        selectedData = [
          {
            diag: document.getElementById("formGroupExampleInput").value,
            score: this.state.selectedCheckbox[0]["scores"],
            checkModif: true
          }
        ];
      }
      const data = new FormData();
      data.append("radiogroup", this.state.selectedCheckbox); //recuperer la donnée de fromback et la checkbok l'indice de validation
      await axios({
        method: "post",
        url: "http://localhost:3001/radio?mail=illshaad.budureea@dgmail.fr",
        data: {
          data: selectedData,
          file: ArrayBack,
          timer: timer,
          Diags: this.state.dataFromBack
        }
      }).then(res => {
        let returnResult = [];
        returnResult.push(res.status);
        if (res.status === 200) {
          returnResult.push("Fichier envoyé");
        } else {
          returnResult.push("error type : " + res.status);
        }
        this.setState({
          selectedFile: null,
          dataFromBack: [],
          selectedCheckbox: [],
          value: 1,
          message: returnResult
        });
      });
    }
  };

  drawLine = () => {
    let result = [];
    let dossier = [];
    if (this.state.listeNomDossier) {
      // console.log(this.state.listeNomDossier, "liste nom dossier");
      for (let i = 0; i < this.state.listeNomDossier.length; i++) {
        dossier.push(this.state.listeNomDossier[i]);
      }
      // console.log(dossier, "mes dossier ici PETIT TEST");
    }
    if (this.state.dataFromBack) {
      this.state.dataFromBack.map((row, i) => {
        if (i >= 0) {
          console.log(row, "testttttttttttruuk");
          result.push(
            <tr key={i}>
              <th scope="row">{dossier[i]}</th>
              <th>{row["diag"]}</th>
              <th>{row["scores"]} % </th>
              <th>
                <Radio.Group name="radiogroup" value={this.state.value}>
                  <Radio onChange={this.handleChange} value={i + 1}></Radio>
                </Radio.Group>
              </th>
            </tr>
          );
        }
      });
    }
    return result;
  };

  render() {
    // console.log("selectedCHECKBOX", this.state.selectedCheckbox);
    var Test = "";
    if (this.state.selectedCheckbox[0]) {
      Test = this.state.selectedCheckbox[0]["diag"];
    }
    let buttonNext = "";
    let champ = null;
    let tab = "";
    let message = "";

    if (this.state.dataFromBack[0] !== undefined) {
      buttonNext = (
        <button className="button-next" onClick={this.sendFileBack}>
          Valider et continuer
        </button>
      );
      console.log(this.state.selectedCheckbox);
      champ = <AutoComplet selectedCheckbox={this.state.selectedCheckbox} />;

      tab = (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nom du dossier</th>
              <th scope="col">Diagnostic</th>
              <th scope="col">Score</th>
              <th scope="col">Validation</th>
            </tr>
          </thead>
          <tbody>{this.drawLine()}</tbody>
        </table>
      );
    }

    if (this.state.message[0] !== undefined) {
      if (this.state.message[0] === 200) {
        message = (
          <div className="alert alert-success" role="alert">
            {this.state.message[1]}
          </div>
        );
      } else {
        message = (
          <div className="alert alert-danger" role="alert">
            {this.state.message[1]}
          </div>
        );
      }
    }
    const loading = this.state.loading;
    if (loading) {
      var texteLoading = <img src="./loading.svg" />;
    }

    return (
      <div className="container">
        <div className="">
          <div className="">
            <div className="logo"></div>
            <div className="d-flex align-items-center bd-highlight">
              <div>
                <div className="text">1</div>
              </div>
              <div>
                <h1>Chargez le dossier</h1>
                <br />
                formats acceptés: docx, pdf, html, png, jpeg, tiff
              </div>
              <div>
                <form method="post" action="#" id="#">
                  <div className="form-group files">
                    <input
                      id="inputFile"
                      type="file"
                      accept=" .txt , .pdf, .png, .svg, .tiff, .tif, .bitmap , .bmp, .html , .htm , .jpg , .jpeg , .doc, .docx , .xml ,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document , "
                      name="file"
                      multiple={true}
                      webkitdirectory="true"
                      mozdirectory="true"
                      onChange={this.loadingFileUpload}
                    />

                    <button
                      type="button"
                      className="btn"
                      onClick={this.OnClickUpload}
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <br />
            {texteLoading}
            <div className="d-flex align-items-center bd-highlight">
              <div>
                <div className="text">2</div>
              </div>
              <div>
                <h1>Consultez le résultat</h1>
                <br />
                le tableau des codifications CIM-10
              </div>
              <div>{tab}</div>
            </div>
            <div className="d-flex align-items-center bd-highlight">
              <div>
                <div className="text">3</div>
              </div>
              <div>
                <h1>Validez ou corrigez</h1>
                <br />
                Si le résultat de l'algorithme ne convient pas,
                <br />
                veuillez corriger le code dans la case en face{" "}
              </div>
              {champ}
            </div>
            {message}
          </div>
          <div className="d-flex justify-content-center">
            <NavLink to="/home">
              <button
                type="button"
                onClick={this.sendFileBack}
                className="Exit"
              >
                Terminer
              </button>
            </NavLink>
            {buttonNext}
          </div>
        </div>
      </div>
    );
  }
}
export default Upload;
