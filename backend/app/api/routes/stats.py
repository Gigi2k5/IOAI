"""
Routes de statistiques avancées
"""
from flask import Blueprint, jsonify
from app.services.stats_service import StatsService
from app.utils import admin_required

bp = Blueprint('stats', __name__)


@bp.route('/dashboard', methods=['GET'])
@admin_required()
def get_dashboard():
    """Stats du dashboard admin"""
    result, _ = StatsService.get_dashboard_stats()
    return jsonify({'success': True, 'data': result})


@bp.route('/regions', methods=['GET'])
@admin_required()
def get_by_region():
    """Stats par région"""
    result, _ = StatsService.get_candidates_by_region()
    return jsonify({'success': True, 'data': result})


@bp.route('/schools', methods=['GET'])
@admin_required()
def get_by_school():
    """Top établissements"""
    result, _ = StatsService.get_candidates_by_school()
    return jsonify({'success': True, 'data': result})


@bp.route('/registrations', methods=['GET'])
@admin_required()
def get_registrations():
    """Inscriptions dans le temps"""
    result, _ = StatsService.get_registrations_over_time()
    return jsonify({'success': True, 'data': result})


@bp.route('/qcm/scores', methods=['GET'])
@admin_required()
def get_score_distribution():
    """Distribution des scores QCM"""
    result, _ = StatsService.get_qcm_score_distribution()
    return jsonify({'success': True, 'data': result})


@bp.route('/qcm/performance', methods=['GET'])
@admin_required()
def get_qcm_performance():
    """Performance par catégorie"""
    result, _ = StatsService.get_qcm_performance_by_category()
    return jsonify({'success': True, 'data': result})


@bp.route('/gender', methods=['GET'])
@admin_required()
def get_gender():
    """Stats par genre"""
    result, _ = StatsService.get_gender_stats()
    return jsonify({'success': True, 'data': result})


@bp.route('/class-levels', methods=['GET'])
@admin_required()
def get_class_levels():
    """Stats par niveau"""
    result, _ = StatsService.get_class_level_stats()
    return jsonify({'success': True, 'data': result})


@bp.route('/report', methods=['GET'])
@admin_required()
def get_full_report():
    """Rapport complet (pour export)"""
    result, _ = StatsService.get_full_report()
    return jsonify({'success': True, 'data': result})
