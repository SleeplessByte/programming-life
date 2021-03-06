# Simulates substrates/products/metabolites in the cell
#
# Parameters
# --------------------------------------------------------
# 
# - supply
#    - The supply per time unit
#
# Equations
# --------------------------------------------------------
#
# - this / dt
#    - supply
#
class Model.Metabolite extends Model.Module

	# Placement of the Metabolite in the cell
	@Inside = 2
	
	# Placement of the Metabolite outside the cell
	@Outside = 1
	
	# Metabolite substrate type
	@Substrate = 1
	
	# Metabolite product type
	@Product = -1

	# Constructor for Metabolite
	#
	# @param params [Object] parameters for this module
	# @option params [Integer] start the start amount of this metabolite
	# @option params [Integer] placement the placement
	# @option params [Integer] type the type
	#
	constructor: ( params = {}, start, name, placement, type ) ->
					
		# Define differential equations here
		step = ( t, compounds, mu ) ->		
			
			results = {}
			
			# Only if the components are available
			if ( @_test( compounds, @name ) )
				
				# A metabolite can be supplied to. Normally this is only true for external
				# substrates. The other metabolites have a value of 0.
				# 
				results[ @name ] = @supply
				
			return results

		# Get the defaults
		defaults = Metabolite.getParameterDefaults( )
		
		if start?
			defaults.starts.name = start
		if name?
			defaults.name = name
		if placement?
			defaults.placement = placement
		if type?
			defaults.type = type

		params = _( params ).defaults( defaults )
		metadata = Metabolite.getParameterMetaData()
		
		super params, step, metadata
		
	# Define the dynamic properties of the module
	#
	# @param params [Object] The parameters to define
	#
	_defineDynamicProperties: ( params ) ->
		@_nonEnumerableValue( '_name', params.name?.split("#")[0] )
		Object.defineProperty( @ , "name",
		
			set: ( param ) ->
				todo = _( ( value ) => @['_name'] = value ).bind( @, param?.split( '#' )[0] )
				undo = _( ( value ) => @['_name'] = value ).bind( @, @[ '_name' ] )
				
				action = new Model.Action( 
					@, todo, undo, 
					"Change name from #{@[ '_name' ]} to #{param}" 
				)
				action.do()
			
				@_trigger( 'module.property.changed', @, [ action ] )
				
			get: ->
				
				return @["_name"] + "#int" if @placement is Model.Metabolite.Inside
				return @["_name"] + "#ext" if @placement is Model.Metabolite.Outside
				return @["_name"] 
				
			enumerable: true
			configurable: false
		)
		params = _( params ).omit("name")
		super params
		
		@_dynamicProperties.push 'name'
		
	# Get parameter defaults array
	#
	# @return [Object] default values
	#
	@getParameterDefaults: () ->
		return { 
		
			# Parameters
			supply: 1
			
			# Meta-Parameters
			placement : Metabolite.Outside
			type : Metabolite.Substrate
			
			# Start values
			starts : { name: 1 }
		}
		
	# Get parameter metadata
	#
	# @return [Object] metadata values
	#
	@getParameterMetaData: () ->
		return {
		
			properties:
				parameters: [ 'supply' ]
				enumerations: [ 
					{
						name: 'placement'
						values: 
							Outside: Model.Metabolite.Outside
							Inside: Model.Metabolite.Inside
					}, {
						name: 'type'
						values: 
							Substrate: Model.Metabolite.Substrate
							Product: Model.Metabolite.Product
					}
				]
				
			tests:
				compounds: [ 'name' ]
		}
		
	# Constructor for External Substrates
	#
	# @param params [Object] parameters for this module
	# @param start [Integer] the initial value of metabolite, defaults to 1
	# @param name [String] the name to use
	# @option params [Integer] start the start amount of this metabolite
	# @option params [Integer] placement the placement
	# @option params [Integer] type the type
	#
	@sext: ( params = { }, supply = 1, start = 1, name = "s" ) -> 
		return new Model.Metabolite( _( params ).extend( { supply: supply } ), start, name,  Model.Metabolite.Outside, Metabolite.Substrate )
		
	# Constructor for Internal Substrates
	#
	# @param params [Object] parameters for this module
	# @param start [Integer] the initial value of metabolite, defaults to 0
	# @param name [String] the name to use
	# @option params [Integer] start the start amount of this metabolite
	# @option params [Integer] placement the placement
	# @option params [Integer] type the type
	#
	@sint: ( params = {}, start = 0, name = "s" ) -> 
		return new Model.Metabolite( _( params ).extend( { supply: 0 } ), start, name,  Model.Metabolite.Inside, Metabolite.Substrate )
	
	# Constructor for Internal Products
	#
	# @param params [Object] parameters for this module
	# @param start [Integer] the initial value of metabolite, defaults to 0
	# @param name [String] the name to use
	# @option params [Integer] start the start amount of this metabolite
	# @option params [Integer] placement the placement
	# @option params [Integer] type the type
	#
	@pint: ( params = {}, start = 0, name = "p" ) -> 
		return new Model.Metabolite(  _( params ).extend( { supply: 0 } ), start, name,  Model.Metabolite.Inside, Metabolite.Product )
		
	# Constructor for External Products
	#
	# @param params [Object] parameters for this module
	# @param start [Integer] the initial value of metabolite, defaults to 0
	# @param name [String] the name to use
	# @option params [Integer] start the start amount of this metabolite
	# @option params [Integer] placement the placement
	# @option params [Integer] type the type
	#
	@pext: ( params = {}, start = 0, name = "p" ) -> 
		return new Model.Metabolite(  _( params ).extend( { supply: 0 } ), start, name,  Model.Metabolite.Outside, Metabolite.Product )
