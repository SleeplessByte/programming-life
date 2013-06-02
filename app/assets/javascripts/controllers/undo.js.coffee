# The controller for the Undo view
#
class Controller.Undo extends Controller.Base

	# Creates a new instance of Undo
	#
	#
	#
	#
	constructor: ( @model, view ) ->
		super view ? new View.Undo( @model )
		@_bind "tree.node.selected", @, @_onNodeSelected
		@_bind "view.undo.branch", @, @_onBranch
		
	# Set the timemachine of the view
	#
	# @param timemachine [Mixin.TimeMachine] The timemachine
	#
	setTimeMachine: ( timemachine ) ->
		@view.setTree timemachine
		return this
	
	# Gets called when a node is selected in the view
	#
	# @param source [View.Undo] The undo view in which the event occurs
	# @param node [Model.Node] The node that was selected
	#
	_onNodeSelected: ( source, node ) ->
		if source is @view
			nodes = @view.tree.jump( node )
			for undo in nodes.reverse
				undo.object.undo()
			for redo in nodes.forward
				redo.object.redo()

			console.log(nodes.reverse...,nodes.forward...)

			@view.selectNode(node)
	
	# Gets called when branching occurs
	#
	# @param direction [Integer] The direction of the branching. -1 == left, 1 == right
	#
	_onBranch: ( source, direction ) ->
		if source is @view
			@branch direction
	
	# Move one branch to either direction
	#
	# @param direction [int] the direction (-1 or 1) in which to move
	#
	branch: ( direction ) ->
		length = @view.tree.current.parent.children.length
		return unless length?

		branchIndex = @view.tree.current.parent.children.indexOf @view.tree.current.parent.branch
		
		switch length
			when 1
				index = 0
			when 2
				index = !branchIndex + 0
			else
				index = (branchIndex + direction + length) % length

		node = @view.tree.current.parent.children[index]
		old = @view.tree.switchBranch( node )
		old.object.undo()
		node.object.redo()
	
	# Focuses the undo view on a specific timemachine
	#
	# @param timemachine [Mixin.TimeMachine] The timemachine to focus on
	#
	focusTimeMachine: ( timemachine ) ->
		nodes = []
		for otherNode in timemachine.iterator()
			node = @view.tree.find( otherNode.object )
			nodes.push node if node?
		for node in @view.tree.iterator()
			if node in nodes
				@view.setActive( node )
			else
				@view.setInactive( node )
