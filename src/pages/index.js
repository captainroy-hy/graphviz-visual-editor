import React from 'react';
import 'typeface-roboto';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import ButtonAppBar from '../ButtonAppBar';
import Graph from '../Graph';
import TextEditor from '../TextEditor';
import MainMenu from '../MainMenu';
import SettingsDialog from '../SettingsDialog';
import DrawingPanels from '../DrawingPanels';
import FormatDrawer from '../FormatDrawer';
import { schemeCategory10 as d3_schemeCategory10} from 'd3-scale-chromatic';
import { schemePaired as d3_schemePaired} from 'd3-scale-chromatic';

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  paper: {
    // viewport height - app bar - 2 * padding
    height: "calc(100vh - 64px - 2 * 12px)",
  }
});

class Index extends React.Component {

  constructor(props) {
    super(props);
    let dotSrc = localStorage.getItem('dotSrc');
    if (dotSrc == null) {
      dotSrc = `strict digraph {
    a [shape="ellipse" style="filled" fillcolor="` + d3_schemeCategory10[0] + `"]
    b [shape="polygon" style="filled" fillcolor="` + d3_schemeCategory10[1] + `"]
    a -> b [fillcolor="` + d3_schemePaired[0] + `" color="` + d3_schemePaired[1] + `"]
}`;
    }
    this.state = {
      initialized: false,
      dotSrc: dotSrc,
      mainMenuIsOpen: false,
      settingsDialogIsOpen: false,
      mode: localStorage.getItem('mode') || 'browse',
      nodeFormatDrawerIsOpen: (localStorage.getItem('nodeFormatDrawerIsOpen') || 'false') === 'true',
      edgeFormatDrawerIsOpen: (localStorage.getItem('edgeFormatDrawerIsOpen') || 'false') === 'true',
      fitGraph : localStorage.getItem('fitGraph') === 'true',
      engine : localStorage.getItem('engine') || 'dot',
      defaultNodeAttributes: JSON.parse(localStorage.getItem('defaultNodeAttributes')) || {},
      defaultEdgeAttributes: JSON.parse(localStorage.getItem('defaultEdgeAttributes')) || {},
      error: null,
    };
  }

  setPersistentState = (updater) => {
    this.setState(updater, function (updater) {
      if (typeof updater === 'function') {
        var obj = updater(this.state);
      } else {
        obj = updater;
      }
      Object.keys(obj).forEach((key) => {
        let value = obj[key];
        if (typeof value === 'boolean') {
          value = value.toString();
        }
        else if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
      });
    }.bind(this, updater));
  }

  handleTextChange = (text) => {
    this.setPersistentState({
      dotSrc: text
    });
    this.setState({
      error: null,
    });
  }

  handleMainMenuButtonClick = (anchorEl) => {
    this.setState({
      mainMenuIsOpen: true,
      mainMenuAnchorEl: anchorEl,
    });
  }

  handleMainMenuClose = () => {
    this.setState({
      mainMenuIsOpen: false,
    });
  }

  handleModeChange = (mode) => {
    this.setPersistentState({
      mode: mode,
    });
  }

  handleNodeFormatClick = () => {
    this.setPersistentState({
      nodeFormatDrawerIsOpen: true,
    });
  }

  handleNodeFormatDrawerClose = () => {
    this.setPersistentState({
      nodeFormatDrawerIsOpen: false,
    });
  }

  handleEdgeFormatClick = () => {
    this.setPersistentState({
      edgeFormatDrawerIsOpen: true,
    });
  }

  handleEdgeFormatDrawerClose = () => {
    this.setPersistentState({
      edgeFormatDrawerIsOpen: false,
    });
  }

  handleSettingsClick = () => {
    this.setState({
      settingsDialogIsOpen: true,
    });
  }
  handleSettingsClose = () => {
    this.setState({
      settingsDialogIsOpen: false,
    });
  }

  handleEngineSelectChange = (engine) => {
    this.setPersistentState({
      engine: engine,
    });
  }

  handleFitGraphSwitchChange = (fitGraph) => {
    this.setPersistentState({
      fitGraph: fitGraph,
    });
  }

  handleNodeShapeClick = (shape) => {
    let x0 = null;
    let y0 = null;
    this.insertNode(x0, y0, {shape: shape});
  }

  handleNodeStyleChange = (style) => {
    this.setPersistentState(prevState => ({
      defaultNodeAttributes: {
          ...prevState.defaultNodeAttributes,
        style: style,
      },
    }));
  }

  handleNodeColorChange = (color) => {
    this.setPersistentState(prevState => ({
      defaultNodeAttributes: {
          ...prevState.defaultNodeAttributes,
        color: color,
      },
    }));
  }

  handleNodeFillColorChange = (color) => {
    this.setPersistentState(prevState => ({
      defaultNodeAttributes: {
          ...prevState.defaultNodeAttributes,
        fillcolor: color,
      },
    }));
  }

  handleEdgeStyleChange = (style) => {
    this.setPersistentState(prevState => ({
      defaultEdgeAttributes: {
          ...prevState.defaultEdgeAttributes,
        style: style,
      },
    }));
  }

  handleEdgeColorChange = (color) => {
    this.setPersistentState(prevState => ({
      defaultEdgeAttributes: {
          ...prevState.defaultEdgeAttributes,
        color: color,
      },
    }));
  }

  handleEdgeFillColorChange = (color) => {
    this.setPersistentState(prevState => ({
      defaultEdgeAttributes: {
          ...prevState.defaultEdgeAttributes,
        fillcolor: color,
      },
    }));
  }

  registerNodeShapeClick = (handleNodeShapeClick) => {
    this.handleNodeShapeClick = handleNodeShapeClick;
  }

  registerNodeShapeDragStart = (handleNodeShapeDragStart) => {
    this.handleNodeShapeDragStart = handleNodeShapeDragStart;
  }

  registerNodeShapeDragEnd = (handleNodeShapeDragEnd) => {
    this.handleNodeShapeDragEnd = handleNodeShapeDragEnd;
  }

  registerZoomInButtonClick = (handleZoomInButtonClick) => {
    this.handleZoomInButtonClick = handleZoomInButtonClick;
  }

  registerZoomOutButtonClick = (handleZoomOutButtonClick) => {
    this.handleZoomOutButtonClick = handleZoomOutButtonClick;
  }

  registerZoomOutMapButtonClick = (handleZoomOutMapButtonClick) => {
    this.handleZoomOutMapButtonClick = handleZoomOutMapButtonClick;
  }

  registerZoomResetButtonClick = (handleZoomResetButtonClick) => {
    this.handleZoomResetButtonClick = handleZoomResetButtonClick;
  }

  handleGraphInitialized = () => {
    this.setState({
      graphInitialized: true,
    });
  }

  handleError = (error) => {
    if (JSON.stringify(error) !== JSON.stringify(this.state.error)) {
      this.setState({
        error: error,
      });
    }
  }

  render() {
    const { classes } = this.props;

    var columns;
    if (this.state.mode === 'draw' && this.state.graphInitialized) {
      columns = {
        textEditor: 3,
        drawPanel: 3,
        graph: 6,
      }
    } else { /* browse */
      columns = {
        textEditor: 6,
        drawPanel: false,
        graph: 6,
      }
    }
    return (
      <div className={classes.root}>
        {/* FIXME: Find a way to get viz.js from the graphviz-visual-editor bundle */}
        <script src="https://unpkg.com/viz.js@1.8.2/viz.js" type="javascript/worker"></script>
        <ButtonAppBar
          onMenuButtonClick={this.handleMainMenuButtonClick}
          onModeChange={this.handleModeChange}
          onNodeFormatClick={this.handleNodeFormatClick}
          onEdgeFormatClick={this.handleEdgeFormatClick}
          onZoomInButtonClick={this.handleZoomInButtonClick}
          onZoomOutButtonClick={this.handleZoomOutButtonClick}
          onZoomOutMapButtonClick={this.handleZoomOutMapButtonClick}
          onZoomResetButtonClick={this.handleZoomResetButtonClick}
        >
        </ButtonAppBar>
        <MainMenu
          anchorEl={this.state.mainMenuAnchorEl}
          open={this.state.mainMenuIsOpen}
          onMenuClose={this.handleMainMenuClose}
          onSettingsClick={this.handleSettingsClick}
        />
        <SettingsDialog
          open={this.state.settingsDialogIsOpen}
          engine={this.state.engine}
          fitGraph={this.state.fitGraph}
          onEngineSelectChange={this.handleEngineSelectChange}
          onFitGraphSwitchChange={this.handleFitGraphSwitchChange}
          onSettingsClose={this.handleSettingsClose}
        />
        <Grid container
          spacing={24}
          style={{
            margin: 0,
            width: '100%',
          }}
        >
          <Grid item xs={columns.textEditor}>
            <Paper className={classes.paper}>
              <FormatDrawer
                type='node'
                open={this.state.nodeFormatDrawerIsOpen}
                defaultAttributes={this.state.defaultNodeAttributes}
                onFormatDrawerClose={this.handleNodeFormatDrawerClose}
                onStyleChange={this.handleNodeStyleChange}
                onColorChange={this.handleNodeColorChange}
                onFillColorChange={this.handleNodeFillColorChange}
              />
              <FormatDrawer
                type='edge'
                open={this.state.edgeFormatDrawerIsOpen}
                defaultAttributes={this.state.defaultEdgeAttributes}
                onFormatDrawerClose={this.handleEdgeFormatDrawerClose}
                onStyleChange={this.handleEdgeStyleChange}
                onColorChange={this.handleEdgeColorChange}
                onFillColorChange={this.handleEdgeFillColorChange}
              />
              <TextEditor
                // allocated viewport width - 2 * padding
                width={`calc(${columns.textEditor * 100 / 12}vw - 2 * 12px)`}
                dotSrc={this.state.dotSrc}
                onTextChange={this.handleTextChange}
                error={this.state.error}
              />
            </Paper>
          </Grid>
          {this.state.mode === 'draw' && this.state.graphInitialized && (
              <Grid item xs={columns.drawPanel}>
                <Paper className={classes.paper}>
                  <DrawingPanels
                    onNodeShapeClick={this.handleNodeShapeClick}
                    onNodeShapeDragStart={this.handleNodeShapeDragStart}
                    onNodeShapeDragEnd={this.handleNodeShapeDragEnd}
                  />
                </Paper>
              </Grid>
          )}
          <Grid item xs={columns.graph}>
            <Paper className={classes.paper}>
              <Graph
                dotSrc={this.state.dotSrc}
                engine={this.state.engine}
                fit={this.state.fitGraph}
                defaultNodeAttributes={this.state.defaultNodeAttributes}
                defaultEdgeAttributes={this.state.defaultEdgeAttributes}
                onTextChange={this.handleTextChange}
                registerNodeShapeClick={this.registerNodeShapeClick}
                registerNodeShapeDragStart={this.registerNodeShapeDragStart}
                registerNodeShapeDragEnd={this.registerNodeShapeDragEnd}
                registerZoomInButtonClick={this.registerZoomInButtonClick}
                registerZoomOutButtonClick={this.registerZoomOutButtonClick}
                registerZoomOutMapButtonClick={this.registerZoomOutMapButtonClick}
                registerZoomResetButtonClick={this.registerZoomResetButtonClick}
                onInitialized={this.handleGraphInitialized}
                onError={this.handleError}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
