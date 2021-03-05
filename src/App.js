import React from "react";
import Graph from 'vis-react';
import CSVReader from 'react-csv-reader'
import { CSVLink } from "react-csv";

class App extends React.Component{
    state = {
        data : [],
        graphData : {
            edges : [],
            nodes : []
        },
        header : [
            {label : "id", key : "nodes"},
            {label : "label", key : "edges"},
            {label : "shape", key : "shape"},
            {label : "image", key : "image"},
            {label : "size", key : "size"},
            {label : "from", key : "from"},
            {label : "to", key : "key"}
        ],
        filename : "test.csv",
        nodes : [
            { 
                id: 1, 
                shape: 'image', 
                size: 60, 
                image: "https://cdn6.f-cdn.com/ppic/165487764/logo/51594309/gXP2n/profile_logo_DINBZ_86562cd2efd4f8642060aaca3265d29b.jpg", 
                label: 'Node 1' 
            },
            { id: 2, label: 'Node 2' },
            { id: 3, label: 'Node 3' },
            { id: 4, label: 'Node 4' },
            { id: 5, label: 'Node 5' },
            { id: 6, label: 'Node 6' },
        ],
        edges: [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 2, to: 4 },
            { from: 2, to: 5 },
            { from: 3, to: 6 }
        ]
    }
    handleUpdateGraph = (data, fileInfo) => {
        console.log(data)
        let nodes = [];
        let edges = [];
        for(let i = 0; i < data.length; i ++){
            if(data[i].id !== "" && data[i].label !== ""){
                let node = {};
                node.id = data[i].id;
                node.label = data[i].label;
                node.shape = data[i].shape;
                node.image = data[i].image;
                node.size = data[i].size;
                nodes.push(node);
            }
            if(data[i].from !== "" && data[i].to !== ""){
                let edge = {};
                edge.from = data[i].from;
                edge.to = data[i].to;
                edges.push(edge);
            }
        }
        const graphData = {
            edges, nodes
        }
        this.setState({ graphData });
    }
    handleForce = (data, fileInfo) => this.handleUpdateGraph(data, fileInfo);
    componentDidMount(){
        let data = [];
        const nodes = this.state.nodes;
        const edges = this.state.edges;
        const length = nodes.length >= edges.length ? nodes.length : edges.length;
        for(let i = 0; i < length; i ++){
            let row = {}
            try{
                row["id"] = nodes[i]["id"];
                row["label"] = nodes[i]["label"];
                row["image"] = nodes[i]["image"];
                row["shape"] = nodes[i]["shape"];
                row["size"] = nodes[i]["size"];
            } catch {
                row["id"] = null;
                row["label"] = null;
                row["image"] = null;
                row["shape"] = null;
            }
            try{
                row["from"] = edges[i]["from"];
                row["to"] = edges[i]["to"];
            } catch {
                row["from"] = null;
                row["to"] = null;
            }
            data.push(row);
        }
        this.setState({ data });
    }
    render(){
        const options = {
            edges: {
                color: '#234234'
            },
            interaction: { hoverEdges: true }
        };
        const events = {
            select: function(event) {
                const { nodes, edges } = event;
                console.log(nodes, edges)
            }
        }; 
        const papaparseOptions = {
            header: true,
            layout: {
                hierarchical: true
            },
            nodes:{
                borderRadius : 30
            }
        }
        return (
            <>
                <Graph
                    graph={this.state.graphData}
                    options={options}
                    events={events}
                    style={{
                        position : "absolute",
                        width : "100%",
                        height : "100%"
                    }}
                    getNetwork={this.getNetwork}
                    getEdges={this.getEdges}
                    getNodes={this.getNodes}
                    vis={vis => (this.vis = vis)}
                />
                <div className="toolbar" >
                    <CSVReader
                        cssClass="csv-reader-input"
                        label="Import CSV"
                        onFileLoaded={this.handleForce}
                        parserOptions={papaparseOptions}
                        inputId="ObiWan"
                        inputName="ObiWan"
                        inputStyle={{color: 'transparent'}}
                    />
                    <CSVLink data={this.state.data} header={this.state.header} filename={this.state.filename}>Export to CSV</CSVLink>
                </div>
            </>
        );

    }
}
export default App;
